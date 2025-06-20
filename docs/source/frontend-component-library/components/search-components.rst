Search Components
=================

Search components provide advanced search and filtering functionality with internationalization and accessibility support.

Search
------

Basic search component with debounced input and clear functionality.

Usage
~~~~~

.. code-block:: typescript

   import { Search } from '@/components/ui/search';

   // Basic usage
   <Search
     placeholder="Search..."
     onValueChange={(value) => console.log(value)}
   />

   // With controlled value
   function SearchExample() {
     const [searchValue, setSearchValue] = useState('');

     return (
       <Search
         value={searchValue}
         onValueChange={setSearchValue}
         placeholder="Search users..."
       />
     );
   }

Props
~~~~~

.. list-table::
   :header-rows: 1
   :widths: 20 20 20 40

   * - Prop
     - Type
     - Default
     - Description
   * - placeholder
     - string
     - undefined
     - Placeholder text
   * - value
     - string
     - ''
     - Controlled value
   * - onValueChange
     - (value: string) => void
     - undefined
     - Value change handler
   * - onSearch
     - (query: string) => void
     - undefined
     - Search handler
   * - debounceMs
     - number
     - 300
     - Debounce delay in milliseconds
   * - className
     - string
     - undefined
     - Additional CSS classes

Features
~~~~~~~~

* **Debounced Input**: Prevents excessive API calls
* **Clear Button**: Easy way to clear search input
* **Search Icon**: Visual search indicator
* **Keyboard Support**: Enter key triggers search
* **Accessibility**: Proper ARIA labels and roles

SearchWithFilters
-----------------

Advanced search component with filtering capabilities and active filter display.

Usage
~~~~~

.. code-block:: typescript

   import { SearchWithFilters } from '@/components/ui/search';

   function AdvancedSearch() {
     const filters = [
       {
         id: 'role',
         label: 'Role',
         type: 'select',
         options: [
           { value: 'admin', label: 'Admin' },
           { value: 'user', label: 'User' },
           { value: 'editor', label: 'Editor' },
         ],
       },
       {
         id: 'status',
         label: 'Status',
         type: 'checkbox',
         options: [
           { value: 'active', label: 'Active' },
           { value: 'inactive', label: 'Inactive' },
           { value: 'pending', label: 'Pending' },
         ],
       },
     ];

     const handleSearch = (query, filters) => {
       console.log('Search:', query, 'Filters:', filters);
       // Perform search with query and filters
     };

     return (
       <SearchWithFilters
         placeholder="Search users..."
         filters={filters}
         onSearch={handleSearch}
         showFilters={true}
       />
     );
   }

Filter Types
~~~~~~~~~~~~

Select Filter
^^^^^^^^^^^^^

Single selection dropdown filter:

.. code-block:: typescript

   {
     id: 'category',
     label: 'Category',
     type: 'select',
     options: [
       { value: 'electronics', label: 'Electronics' },
       { value: 'clothing', label: 'Clothing' },
       { value: 'books', label: 'Books' },
     ],
   }

Checkbox Filter
^^^^^^^^^^^^^^^

Multiple selection checkbox filter:

.. code-block:: typescript

   {
     id: 'features',
     label: 'Features',
     type: 'checkbox',
     options: [
       { value: 'wireless', label: 'Wireless' },
       { value: 'waterproof', label: 'Waterproof' },
       { value: 'portable', label: 'Portable' },
     ],
   }

Range Filter
^^^^^^^^^^^^

Numeric range filter (planned feature):

.. code-block:: typescript

   {
     id: 'price',
     label: 'Price Range',
     type: 'range',
     min: 0,
     max: 1000,
     step: 10,
   }

Props
~~~~~

.. list-table::
   :header-rows: 1
   :widths: 20 20 20 40

   * - Prop
     - Type
     - Default
     - Description
   * - filters
     - SearchFilter[]
     - []
     - Array of filter definitions
   * - showFilters
     - boolean
     - true
     - Show filter button and panel
   * - onSearch
     - (query: string, filters: Record<string, any>) => void
     - undefined
     - Search handler with filters
   * - placeholder
     - string
     - undefined
     - Search input placeholder
   * - debounceMs
     - number
     - 300
     - Debounce delay

Filter Interface
~~~~~~~~~~~~~~~~

.. code-block:: typescript

   interface SearchFilter {
     id: string;
     label: string;
     type: 'select' | 'checkbox' | 'range';
     options?: { value: string; label: string }[];
     value?: any;
   }

Advanced Usage
~~~~~~~~~~~~~~

.. code-block:: typescript

   function ProductSearch() {
     const [searchResults, setSearchResults] = useState([]);
     const [loading, setLoading] = useState(false);

     const filters = [
       {
         id: 'category',
         label: 'Category',
         type: 'select',
         options: [
           { value: 'electronics', label: 'Electronics' },
           { value: 'clothing', label: 'Clothing' },
           { value: 'home', label: 'Home & Garden' },
         ],
       },
       {
         id: 'brand',
         label: 'Brand',
         type: 'checkbox',
         options: [
           { value: 'apple', label: 'Apple' },
           { value: 'samsung', label: 'Samsung' },
           { value: 'sony', label: 'Sony' },
         ],
       },
       {
         id: 'availability',
         label: 'Availability',
         type: 'checkbox',
         options: [
           { value: 'in-stock', label: 'In Stock' },
           { value: 'on-sale', label: 'On Sale' },
           { value: 'new-arrival', label: 'New Arrival' },
         ],
       },
     ];

     const handleSearch = async (query, filterValues) => {
       setLoading(true);
       try {
         const results = await searchProducts({
           query,
           filters: filterValues,
         });
         setSearchResults(results);
       } catch (error) {
         console.error('Search failed:', error);
       } finally {
         setLoading(false);
       }
     };

     return (
       <div className="space-y-6">
         <SearchWithFilters
           placeholder="Search products..."
           filters={filters}
           onSearch={handleSearch}
         />
         
         {loading && (
           <div className="text-center py-8">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
             <p className="mt-2 text-muted-foreground">Searching...</p>
           </div>
         )}
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {searchResults.map((product) => (
             <ProductCard key={product.id} product={product} />
           ))}
         </div>
       </div>
     );
   }

Search Patterns
---------------

Real-time Search
~~~~~~~~~~~~~~~~

.. code-block:: typescript

   function RealTimeSearch() {
     const [query, setQuery] = useState('');
     const [results, setResults] = useState([]);
     const [loading, setLoading] = useState(false);

     // Debounced search effect
     useEffect(() => {
       if (!query.trim()) {
         setResults([]);
         return;
       }

       const timeoutId = setTimeout(async () => {
         setLoading(true);
         try {
           const searchResults = await performSearch(query);
           setResults(searchResults);
         } catch (error) {
           console.error('Search error:', error);
         } finally {
           setLoading(false);
         }
       }, 300);

       return () => clearTimeout(timeoutId);
     }, [query]);

     return (
       <div className="relative">
         <Search
           value={query}
           onValueChange={setQuery}
           placeholder="Search in real-time..."
         />
         
         {query && (
           <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50">
             {loading ? (
               <div className="p-4 text-center">
                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto"></div>
               </div>
             ) : results.length > 0 ? (
               <ul className="max-h-60 overflow-auto">
                 {results.map((result) => (
                   <li key={result.id} className="p-2 hover:bg-accent cursor-pointer">
                     {result.title}
                   </li>
                 ))}
               </ul>
             ) : (
               <div className="p-4 text-center text-muted-foreground">
                 No results found
               </div>
             )}
           </div>
         )}
       </div>
     );
   }

Search with Autocomplete
~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   function AutocompleteSearch() {
     const [query, setQuery] = useState('');
     const [suggestions, setSuggestions] = useState([]);
     const [showSuggestions, setShowSuggestions] = useState(false);

     const handleSearch = async (searchQuery) => {
       if (searchQuery.length < 2) {
         setSuggestions([]);
         return;
       }

       try {
         const results = await getSuggestions(searchQuery);
         setSuggestions(results);
         setShowSuggestions(true);
       } catch (error) {
         console.error('Autocomplete error:', error);
       }
     };

     const handleSelectSuggestion = (suggestion) => {
       setQuery(suggestion);
       setShowSuggestions(false);
       // Perform actual search
       performFullSearch(suggestion);
     };

     return (
       <div className="relative">
         <Search
           value={query}
           onValueChange={(value) => {
             setQuery(value);
             handleSearch(value);
           }}
           placeholder="Start typing for suggestions..."
         />
         
         {showSuggestions && suggestions.length > 0 && (
           <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50">
             <ul>
               {suggestions.map((suggestion, index) => (
                 <li
                   key={index}
                   className="p-2 hover:bg-accent cursor-pointer"
                   onClick={() => handleSelectSuggestion(suggestion)}
                 >
                   {suggestion}
                 </li>
               ))}
             </ul>
           </div>
         )}
       </div>
     );
   }

Saved Searches
~~~~~~~~~~~~~~

.. code-block:: typescript

   function SavedSearches() {
     const [savedSearches, setSavedSearches] = useState([]);
     const [currentSearch, setCurrentSearch] = useState({ query: '', filters: {} });

     const saveCurrentSearch = () => {
       const searchName = prompt('Enter a name for this search:');
       if (searchName) {
         const newSearch = {
           id: Date.now(),
           name: searchName,
           query: currentSearch.query,
           filters: currentSearch.filters,
           createdAt: new Date(),
         };
         setSavedSearches([...savedSearches, newSearch]);
       }
     };

     const loadSavedSearch = (search) => {
       setCurrentSearch({
         query: search.query,
         filters: search.filters,
       });
       // Trigger search
       performSearch(search.query, search.filters);
     };

     return (
       <div className="space-y-4">
         <div className="flex items-center space-x-2">
           <SearchWithFilters
             value={currentSearch.query}
             filters={filters}
             onSearch={(query, filters) => {
               setCurrentSearch({ query, filters });
               performSearch(query, filters);
             }}
           />
           <Button onClick={saveCurrentSearch} variant="outline">
             Save Search
           </Button>
         </div>
         
         {savedSearches.length > 0 && (
           <div>
             <h3 className="text-sm font-medium mb-2">Saved Searches</h3>
             <div className="flex flex-wrap gap-2">
               {savedSearches.map((search) => (
                 <Button
                   key={search.id}
                   variant="outline"
                   size="sm"
                   onClick={() => loadSavedSearch(search)}
                 >
                   {search.name}
                 </Button>
               ))}
             </div>
           </div>
         )}
       </div>
     );
   }

Filter Management
-----------------

Dynamic Filters
~~~~~~~~~~~~~~~

.. code-block:: typescript

   function DynamicFilters() {
     const [availableFilters, setAvailableFilters] = useState([]);
     const [activeFilters, setActiveFilters] = useState([]);

     useEffect(() => {
       // Load available filters based on context
       loadAvailableFilters().then(setAvailableFilters);
     }, []);

     const addFilter = (filterId) => {
       const filter = availableFilters.find(f => f.id === filterId);
       if (filter && !activeFilters.find(f => f.id === filterId)) {
         setActiveFilters([...activeFilters, filter]);
       }
     };

     const removeFilter = (filterId) => {
       setActiveFilters(activeFilters.filter(f => f.id !== filterId));
     };

     return (
       <div className="space-y-4">
         <SearchWithFilters
           filters={activeFilters}
           onSearch={handleSearch}
         />
         
         <div>
           <h3 className="text-sm font-medium mb-2">Add Filters</h3>
           <div className="flex flex-wrap gap-2">
             {availableFilters
               .filter(f => !activeFilters.find(af => af.id === f.id))
               .map((filter) => (
                 <Button
                   key={filter.id}
                   variant="outline"
                   size="sm"
                   onClick={() => addFilter(filter.id)}
                 >
                   + {filter.label}
                 </Button>
               ))}
           </div>
         </div>
       </div>
     );
   }

Filter Presets
~~~~~~~~~~~~~~

.. code-block:: typescript

   function FilterPresets() {
     const presets = [
       {
         name: 'Active Users',
         filters: { status: ['active'], role: 'user' },
       },
       {
         name: 'Recent Orders',
         filters: { dateRange: 'last-7-days', status: ['completed'] },
       },
       {
         name: 'High Priority',
         filters: { priority: ['high', 'urgent'] },
       },
     ];

     const applyPreset = (preset) => {
       // Apply preset filters
       setCurrentFilters(preset.filters);
       performSearch('', preset.filters);
     };

     return (
       <div className="space-y-4">
         <div>
           <h3 className="text-sm font-medium mb-2">Quick Filters</h3>
           <div className="flex flex-wrap gap-2">
             {presets.map((preset) => (
               <Button
                 key={preset.name}
                 variant="outline"
                 size="sm"
                 onClick={() => applyPreset(preset)}
               >
                 {preset.name}
               </Button>
             ))}
           </div>
         </div>
         
         <SearchWithFilters
           filters={filters}
           onSearch={handleSearch}
         />
       </div>
     );
   }

Internationalization
--------------------

Search components support internationalization:

.. code-block:: typescript

   import { useTranslations } from 'next-intl';

   function LocalizedSearch() {
     const t = useTranslations('search');

     const filters = [
       {
         id: 'status',
         label: t('filters.status'),
         type: 'select',
         options: [
           { value: 'active', label: t('status.active') },
           { value: 'inactive', label: t('status.inactive') },
         ],
       },
     ];

     return (
       <SearchWithFilters
         placeholder={t('placeholder')}
         filters={filters}
         onSearch={handleSearch}
       />
     );
   }

Translation Keys
~~~~~~~~~~~~~~~~

.. code-block:: json

   {
     "search": {
       "placeholder": "Search...",
       "noResults": "No results found",
       "filters": {
         "status": "Status",
         "category": "Category",
         "dateRange": "Date Range"
       },
       "status": {
         "active": "Active",
         "inactive": "Inactive",
         "pending": "Pending"
       }
     }
   }

Accessibility
-------------

Search components follow WCAG 2.1 AA guidelines:

* **Keyboard Navigation**: Full keyboard support for all interactions
* **Screen Readers**: Proper ARIA labels and live regions
* **Focus Management**: Logical focus order and visible indicators
* **Search Results**: Results are announced to screen readers
* **Filter State**: Filter changes are communicated accessibly

.. code-block:: typescript

   // Accessible search with live region
   <div>
     <Search
       placeholder="Search users"
       aria-label="Search users"
       onSearch={handleSearch}
     />
     <div aria-live="polite" aria-atomic="true" className="sr-only">
       {searchResults.length > 0 
         ? `${searchResults.length} results found`
         : 'No results found'
       }
     </div>
   </div>

Performance
-----------

Search components are optimized for performance:

* **Debounced Input**: Prevents excessive API calls
* **Memoized Filters**: Filter options are memoized
* **Virtual Scrolling**: For large result sets
* **Request Cancellation**: Previous requests are cancelled

.. code-block:: typescript

   // Optimized search with request cancellation
   function OptimizedSearch() {
     const abortControllerRef = useRef();

     const handleSearch = useCallback(async (query, filters) => {
       // Cancel previous request
       if (abortControllerRef.current) {
         abortControllerRef.current.abort();
       }

       // Create new abort controller
       abortControllerRef.current = new AbortController();

       try {
         const results = await searchAPI(query, filters, {
           signal: abortControllerRef.current.signal,
         });
         setResults(results);
       } catch (error) {
         if (error.name !== 'AbortError') {
           console.error('Search error:', error);
         }
       }
     }, []);

     return (
       <SearchWithFilters
         onSearch={handleSearch}
         debounceMs={300}
       />
     );
   }

Testing
-------

Search components include comprehensive tests:

* **Search Functionality**: Search queries work correctly
* **Filter Application**: Filters are applied and cleared correctly
* **Debouncing**: Input debouncing works as expected
* **Accessibility**: ARIA attributes and keyboard navigation
* **Performance**: No memory leaks or excessive re-renders
