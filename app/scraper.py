import requests
from bs4 import BeautifulSoup
from typing import Optional, List, Dict, Any, Set
import time
import os
import re
from urllib.parse import urljoin, urlparse, urlunparse
from playwright.sync_api import sync_playwright
import json
from collections import defaultdict


class WebScraper:
    def __init__(self):
        self.user_agent = os.getenv(
            "USER_AGENT",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        )
        self.timeout = int(os.getenv("REQUEST_TIMEOUT", "30"))
        self.max_retries = int(os.getenv("MAX_RETRIES", "3"))

    def _get_headers(self) -> Dict[str, str]:
        """Return polite scraping headers"""
        return {
            "User-Agent": self.user_agent,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate",
            "Connection": "keep-alive",
        }

    def _extract_metadata(self, soup: BeautifulSoup, url: str) -> Dict[str, Any]:
        """Extract all metadata from page"""
        metadata = {
            "meta_tags": {},
            "open_graph": {},
            "twitter_cards": {},
            "structured_data": [],
        }

        # Standard meta tags
        for meta in soup.find_all("meta"):
            name = meta.get("name") or meta.get("property") or meta.get("itemprop")
            content = meta.get("content")
            if name and content:
                if name.startswith("og:"):
                    metadata["open_graph"][name] = content
                elif name.startswith("twitter:"):
                    metadata["twitter_cards"][name] = content
                else:
                    metadata["meta_tags"][name] = content

        # Open Graph tags
        og_tags = soup.find_all("meta", property=re.compile(r"^og:"))
        for tag in og_tags:
            prop = tag.get("property")
            content = tag.get("content")
            if prop and content:
                metadata["open_graph"][prop] = content

        # Twitter Card tags
        twitter_tags = soup.find_all("meta", attrs={"name": re.compile(r"^twitter:")})
        for tag in twitter_tags:
            name = tag.get("name")
            content = tag.get("content")
            if name and content:
                metadata["twitter_cards"][name] = content

        # Structured Data (JSON-LD)
        json_ld_scripts = soup.find_all("script", type="application/ld+json")
        for script in json_ld_scripts:
            try:
                data = json.loads(script.string)
                metadata["structured_data"].append(data)
            except:
                pass

        # Microdata
        microdata_items = soup.find_all(attrs={"itemscope": True})
        if microdata_items:
            metadata["microdata"] = []
            for item in microdata_items[:5]:  # Limit to first 5
                item_data = {}
                item_type = item.get("itemtype", "")
                if item_type:
                    item_data["type"] = item_type
                props = item.find_all(attrs={"itemprop": True})
                for prop in props:
                    prop_name = prop.get("itemprop")
                    prop_value = prop.get("content") or prop.get_text(strip=True)
                    if prop_name and prop_value:
                        item_data[prop_name] = prop_value
                if item_data:
                    metadata["microdata"].append(item_data)

        return metadata

    def _extract_contact_info(self, text: str) -> Dict[str, List[str]]:
        """Extract emails and phone numbers from text"""
        contact_info = {
            "emails": [],
            "phones": [],
        }

        # Email regex
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        contact_info["emails"] = list(set(emails))  # Remove duplicates

        # Phone regex (various formats)
        phone_patterns = [
            r'\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}',  # International
            r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}',  # US format
            r'\d{3}[-.\s]?\d{3}[-.\s]?\d{4}',  # Simple format
        ]
        phones = []
        for pattern in phone_patterns:
            found = re.findall(pattern, text)
            phones.extend(found)
        contact_info["phones"] = list(set(phones))[:10]  # Limit to 10

        return contact_info

    def _extract_social_links(self, soup: BeautifulSoup, base_url: str) -> Dict[str, List[str]]:
        """Extract social media links"""
        social_platforms = {
            "facebook": ["facebook.com", "fb.com"],
            "twitter": ["twitter.com", "x.com"],
            "instagram": ["instagram.com"],
            "linkedin": ["linkedin.com"],
            "youtube": ["youtube.com", "youtu.be"],
            "github": ["github.com"],
            "pinterest": ["pinterest.com"],
            "tiktok": ["tiktok.com"],
        }

        social_links = defaultdict(list)
        all_links = soup.find_all("a", href=True)

        for link in all_links:
            href = link.get("href", "")
            full_url = urljoin(base_url, href)

            for platform, domains in social_platforms.items():
                if any(domain in full_url.lower() for domain in domains):
                    social_links[platform].append(full_url)
                    break

        return dict(social_links)

    def _extract_images_detailed(self, soup: BeautifulSoup, base_url: str) -> List[Dict[str, Any]]:
        """Extract images with detailed information"""
        images = []
        for img in soup.find_all("img"):
            src = img.get("src") or img.get("data-src") or img.get("data-lazy-src")
            if src:
                full_url = urljoin(base_url, src)
                images.append({
                    "src": full_url,
                    "alt": img.get("alt", ""),
                    "title": img.get("title", ""),
                    "width": img.get("width"),
                    "height": img.get("height"),
                    "loading": img.get("loading", ""),
                })
        return images

    def _crawl_site(
        self,
        base_url: str,
        max_pages: int = 10,
        use_playwright: bool = False,
        wait_time: int = 3
    ) -> Dict[str, Any]:
        """Crawl multiple pages of a site"""
        visited = set()
        to_visit = [base_url]
        pages_data = []
        domain = urlparse(base_url).netloc

        while to_visit and len(visited) < max_pages:
            current_url = to_visit.pop(0)
            if current_url in visited:
                continue

            try:
                if use_playwright:
                    page_data = self.scrape_with_playwright(current_url, wait_time=wait_time)
                else:
                    page_data = self.scrape_static(current_url)

                visited.add(current_url)
                pages_data.append({
                    "url": current_url,
                    "title": page_data.get("title"),
                    "metadata": page_data.get("metadata", {}),
                    "contact_info": page_data.get("contact_info", {}),
                    "social_links": page_data.get("social_links", {}),
                })

                # Find links on this page
                if "links" in page_data:
                    for link in page_data["links"]:
                        href = link.get("href", "")
                        if href:
                            full_url = urljoin(current_url, href)
                            parsed = urlparse(full_url)
                            # Only follow links from same domain
                            if parsed.netloc == domain and full_url not in visited and len(to_visit) < max_pages * 2:
                                to_visit.append(full_url)

            except Exception as e:
                continue

        return {
            "base_url": base_url,
            "pages_crawled": len(pages_data),
            "pages": pages_data,
            "crawl_type": "site_wide",
        }

    def scrape_static(self, url: str, selectors: Optional[List[str]] = None) -> Dict[str, Any]:
        """
        Scrape static HTML content using requests and BeautifulSoup
        
        Args:
            url: Target URL to scrape
            selectors: Optional list of CSS selectors to extract specific elements
            
        Returns:
            Dictionary containing scraped data
        """
        try:
            response = requests.get(
                url,
                headers=self._get_headers(),
                timeout=self.timeout,
                allow_redirects=True
            )
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'lxml')
            text_content = soup.get_text(separator="\n", strip=True)
            
            result = {
                "url": url,
                "title": soup.title.string if soup.title else None,
                "status_code": response.status_code,
                "content_type": response.headers.get("Content-Type", ""),
                "metadata": self._extract_metadata(soup, url),
                "contact_info": self._extract_contact_info(text_content),
                "social_links": self._extract_social_links(soup, url),
            }
            
            if selectors:
                # Extract specific elements using selectors
                extracted_data = {}
                for selector in selectors:
                    elements = soup.select(selector)
                    extracted_data[selector] = [
                        {
                            "text": elem.get_text(strip=True),
                            "html": str(elem),
                            "attributes": dict(elem.attrs)
                        }
                        for elem in elements
                    ]
                result["extracted"] = extracted_data
            else:
                # Extract all content
                result["text_content"] = text_content[:50000]  # Limit text content
                result["links"] = [
                    {
                        "text": link.get_text(strip=True),
                        "href": urljoin(url, link.get("href")),
                        "title": link.get("title", "")
                    }
                    for link in soup.find_all("a", href=True)
                ]
                result["images"] = self._extract_images_detailed(soup, url)
                
                # Extract headings
                result["headings"] = {
                    "h1": [h.get_text(strip=True) for h in soup.find_all("h1")],
                    "h2": [h.get_text(strip=True) for h in soup.find_all("h2")],
                    "h3": [h.get_text(strip=True) for h in soup.find_all("h3")],
                }
                
                # Extract paragraphs
                paragraphs = [p.get_text(strip=True) for p in soup.find_all("p")]
                result["paragraphs"] = [p for p in paragraphs if len(p) > 20][:50]  # Limit to 50
            
            return result
            
        except requests.exceptions.RequestException as e:
            raise Exception(f"Request failed: {str(e)}")
        except Exception as e:
            raise Exception(f"Scraping failed: {str(e)}")

    def scrape_with_playwright(
        self,
        url: str,
        selectors: Optional[List[str]] = None,
        wait_time: int = 5
    ) -> Dict[str, Any]:
        """
        Scrape JavaScript-rendered content using Playwright
        
        Args:
            url: Target URL to scrape
            selectors: Optional list of CSS selectors to extract specific elements
            wait_time: Time to wait for page to load (seconds)
            
        Returns:
            Dictionary containing scraped data
        """
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True)
                page = browser.new_page()
                page.set_extra_http_headers(self._get_headers())
                
                page.goto(url, wait_until="networkidle", timeout=self.timeout * 1000)
                time.sleep(wait_time)  # Additional wait for dynamic content
                
                # Get page content
                title = page.title()
                content = page.content()
                
                soup = BeautifulSoup(content, 'lxml')
                text_content = soup.get_text(separator="\n", strip=True)
                
                result = {
                    "url": url,
                    "title": title,
                    "status_code": 200,
                    "content_type": "text/html",
                    "metadata": self._extract_metadata(soup, url),
                    "contact_info": self._extract_contact_info(text_content),
                    "social_links": self._extract_social_links(soup, url),
                }
                
                if selectors:
                    # Extract specific elements using selectors
                    extracted_data = {}
                    for selector in selectors:
                        elements = soup.select(selector)
                        extracted_data[selector] = [
                            {
                                "text": elem.get_text(strip=True),
                                "html": str(elem),
                                "attributes": dict(elem.attrs)
                            }
                            for elem in elements
                        ]
                    result["extracted"] = extracted_data
                else:
                    # Extract all content
                    result["text_content"] = text_content[:50000]  # Limit text content
                    result["links"] = [
                        {
                            "text": link.get_text(strip=True),
                            "href": urljoin(url, link.get("href")),
                            "title": link.get("title", "")
                        }
                        for link in soup.find_all("a", href=True)
                    ]
                    result["images"] = self._extract_images_detailed(soup, url)
                    
                    # Extract headings
                    result["headings"] = {
                        "h1": [h.get_text(strip=True) for h in soup.find_all("h1")],
                        "h2": [h.get_text(strip=True) for h in soup.find_all("h2")],
                        "h3": [h.get_text(strip=True) for h in soup.find_all("h3")],
                    }
                    
                    # Extract paragraphs
                    paragraphs = [p.get_text(strip=True) for p in soup.find_all("p")]
                    result["paragraphs"] = [p for p in paragraphs if len(p) > 20][:50]  # Limit to 50
                
                browser.close()
                return result
                
        except Exception as e:
            raise Exception(f"Playwright scraping failed: {str(e)}")

    def scrape(
        self,
        url: str,
        selectors: Optional[List[str]] = None,
        use_playwright: bool = False,
        wait_time: int = 5,
        crawl_site: bool = False,
        max_pages: int = 10
    ) -> Dict[str, Any]:
        """
        Main scraping method that routes to appropriate scraper
        
        Args:
            url: Target URL to scrape (can be domain or full URL)
            selectors: Optional list of CSS selectors
            use_playwright: Whether to use Playwright for JS rendering
            wait_time: Wait time for Playwright
            crawl_site: If True and only domain provided, crawl entire site
            max_pages: Maximum pages to crawl if crawl_site is True
            
        Returns:
            Dictionary containing scraped data
        """
        # Normalize URL
        parsed = urlparse(url)
        if not parsed.scheme:
            url = "https://" + url
            parsed = urlparse(url)
        
        # If only domain provided and crawl_site is True, crawl the site
        if crawl_site and parsed.path in ["", "/"]:
            return self._crawl_site(url, max_pages, use_playwright, wait_time)
        
        # Single page scraping
        if use_playwright:
            return self.scrape_with_playwright(url, selectors, wait_time)
        else:
            return self.scrape_static(url, selectors)
