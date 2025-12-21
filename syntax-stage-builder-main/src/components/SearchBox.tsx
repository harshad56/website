import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Search, X, Code, Globe, BookOpen, Sparkles } from "lucide-react";
import { searchItems, SearchItem } from "@/data/searchData";
import { cn } from "@/lib/utils";

interface SearchBoxProps {
  className?: string;
}

const SearchBox = ({ className }: SearchBoxProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter search results
  const results = useMemo(() => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase().trim();
    
    return searchItems
      .filter(item => {
        // Search in title, keywords, and description
        const titleMatch = item.title.toLowerCase().includes(lowerQuery);
        const keywordMatch = item.keywords.some(kw => kw.toLowerCase().includes(lowerQuery));
        const descMatch = item.description?.toLowerCase().includes(lowerQuery);
        
        return titleMatch || keywordMatch || descMatch;
      })
      .slice(0, 8); // Limit to 8 results
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % results.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setQuery("");
        inputRef.current?.blur();
        break;
    }
  }, [isOpen, results, selectedIndex]);

  // Handle item selection
  const handleSelect = useCallback((item: SearchItem) => {
    navigate(item.path);
    setQuery("");
    setIsOpen(false);
    inputRef.current?.blur();
  }, [navigate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Get icon for category
  const getCategoryIcon = (category: SearchItem['category']) => {
    switch (category) {
      case 'language':
        return <Code className="w-4 h-4" />;
      case 'page':
        return <Globe className="w-4 h-4" />;
      case 'feature':
        return <Sparkles className="w-4 h-4" />;
      case 'keyword':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  // Get category label
  const getCategoryLabel = (category: SearchItem['category']) => {
    switch (category) {
      case 'language':
        return 'Programming Language';
      case 'page':
        return 'Page';
      case 'feature':
        return 'Feature';
      case 'keyword':
        return 'Topic';
      default:
        return '';
    }
  };

  return (
    <>
      {/* Backdrop overlay when dropdown is open */}
      {isOpen && query && results.length > 0 && (
        <div 
          className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-[100]"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <div className={cn("relative w-full max-w-md", className)} ref={dropdownRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search languages, pages, keywords..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => {
              if (query) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            className="pl-10 pr-10 w-full h-10 bg-background border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown Results */}
        {isOpen && query && results.length > 0 && (
          <div className="absolute top-full mt-1.5 w-full bg-background border border-border/50 rounded-lg shadow-2xl z-[101] max-h-[400px] overflow-hidden flex flex-col">
            <div className="p-1 overflow-y-auto">
              {results.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  type="button"
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-md transition-all duration-150 flex items-center gap-3 group",
                    index === selectedIndex
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted/50 text-foreground"
                  )}
                >
                  <div className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center transition-colors",
                    index === selectedIndex
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                  )}>
                    {getCategoryIcon(item.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm mb-0.5 truncate">
                      {item.title}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {item.description}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-xs px-1.5 py-0.5 bg-muted rounded text-muted-foreground">
                        {getCategoryLabel(item.category)}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {isOpen && query && results.length === 0 && (
          <div className="absolute top-full mt-1.5 w-full bg-background border border-border/50 rounded-lg shadow-2xl z-[101] p-6">
            <div className="text-center">
              <Search className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
              <div className="text-sm font-medium text-foreground mb-1">
                No results found
              </div>
              <div className="text-xs text-muted-foreground">
                Try searching for "{query}" with different keywords
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchBox;

