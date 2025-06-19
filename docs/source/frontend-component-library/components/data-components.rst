Data Components
===============

Data components provide functionality for displaying, organizing, and visualizing data with internationalization and accessibility support.

Table
-----

Comprehensive data table component with sorting, filtering, and responsive design.

Usage
~~~~~

.. code-block:: typescript

   import {
     Table,
     TableBody,
     TableCaption,
     TableCell,
     TableHead,
     TableHeader,
     TableRow,
   } from '@/components/ui/table';

   const data = [
     { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
     { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
   ];

   function DataTable() {
     return (
       <Table>
         <TableCaption>A list of recent users</TableCaption>
         <TableHeader>
           <TableRow>
             <TableHead>Name</TableHead>
             <TableHead>Email</TableHead>
             <TableHead>Role</TableHead>
             <TableHead className="text-right">Actions</TableHead>
           </TableRow>
         </TableHeader>
         <TableBody>
           {data.map((user) => (
             <TableRow key={user.id}>
               <TableCell className="font-medium">{user.name}</TableCell>
               <TableCell>{user.email}</TableCell>
               <TableCell>{user.role}</TableCell>
               <TableCell className="text-right">
                 <Button variant="ghost" size="sm">Edit</Button>
               </TableCell>
             </TableRow>
           ))}
         </TableBody>
       </Table>
     );
   }

Components
~~~~~~~~~~

Table
^^^^^

Root table container with proper semantic structure.

TableHeader
^^^^^^^^^^^

Table header section containing column headers.

TableBody
^^^^^^^^^

Table body section containing data rows.

TableRow
^^^^^^^^

Individual table row component.

TableHead
^^^^^^^^^

Table header cell component.

TableCell
^^^^^^^^^

Table data cell component.

TableCaption
^^^^^^^^^^^^

Optional table caption for accessibility.

Advanced Usage
~~~~~~~~~~~~~~

.. code-block:: typescript

   // Sortable table
   function SortableTable() {
     const [sortField, setSortField] = useState('name');
     const [sortDirection, setSortDirection] = useState('asc');

     const sortedData = useMemo(() => {
       return [...data].sort((a, b) => {
         if (sortDirection === 'asc') {
           return a[sortField] > b[sortField] ? 1 : -1;
         }
         return a[sortField] < b[sortField] ? 1 : -1;
       });
     }, [data, sortField, sortDirection]);

     const handleSort = (field) => {
       if (sortField === field) {
         setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
       } else {
         setSortField(field);
         setSortDirection('asc');
       }
     };

     return (
       <Table>
         <TableHeader>
           <TableRow>
             <TableHead>
               <Button
                 variant="ghost"
                 onClick={() => handleSort('name')}
                 className="h-auto p-0 font-semibold"
               >
                 Name
                 {sortField === 'name' && (
                   sortDirection === 'asc' ? <ChevronUp /> : <ChevronDown />
                 )}
               </Button>
             </TableHead>
           </TableRow>
         </TableHeader>
         <TableBody>
           {sortedData.map((item) => (
             <TableRow key={item.id}>
               <TableCell>{item.name}</TableCell>
             </TableRow>
           ))}
         </TableBody>
       </Table>
     );
   }

Pagination
----------

Data pagination component with navigation controls and page information.

Usage
~~~~~

.. code-block:: typescript

   import {
     Pagination,
     PaginationContent,
     PaginationEllipsis,
     PaginationItem,
     PaginationLink,
     PaginationNext,
     PaginationPrevious,
   } from '@/components/ui/pagination';

   function DataPagination() {
     return (
       <Pagination>
         <PaginationContent>
           <PaginationItem>
             <PaginationPrevious href="#" />
           </PaginationItem>
           <PaginationItem>
             <PaginationLink href="#" isActive>1</PaginationLink>
           </PaginationItem>
           <PaginationItem>
             <PaginationLink href="#">2</PaginationLink>
           </PaginationItem>
           <PaginationItem>
             <PaginationLink href="#">3</PaginationLink>
           </PaginationItem>
           <PaginationItem>
             <PaginationEllipsis />
           </PaginationItem>
           <PaginationItem>
             <PaginationNext href="#" />
           </PaginationItem>
         </PaginationContent>
       </Pagination>
     );
   }

Advanced Pagination
~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   function AdvancedPagination({ 
     currentPage, 
     totalPages, 
     onPageChange 
   }: {
     currentPage: number;
     totalPages: number;
     onPageChange: (page: number) => void;
   }) {
     const generatePageNumbers = () => {
       const pages = [];
       const showEllipsis = totalPages > 7;

       if (!showEllipsis) {
         for (let i = 1; i <= totalPages; i++) {
           pages.push(i);
         }
       } else {
         // Complex logic for showing ellipsis
         if (currentPage <= 4) {
           pages.push(1, 2, 3, 4, 5, '...', totalPages);
         } else if (currentPage >= totalPages - 3) {
           pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
         } else {
           pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
         }
       }

       return pages;
     };

     return (
       <Pagination>
         <PaginationContent>
           <PaginationItem>
             <PaginationPrevious 
               onClick={() => onPageChange(currentPage - 1)}
               disabled={currentPage === 1}
             />
           </PaginationItem>
           
           {generatePageNumbers().map((page, index) => (
             <PaginationItem key={index}>
               {page === '...' ? (
                 <PaginationEllipsis />
               ) : (
                 <PaginationLink
                   onClick={() => onPageChange(page as number)}
                   isActive={page === currentPage}
                 >
                   {page}
                 </PaginationLink>
               )}
             </PaginationItem>
           ))}
           
           <PaginationItem>
             <PaginationNext 
               onClick={() => onPageChange(currentPage + 1)}
               disabled={currentPage === totalPages}
             />
           </PaginationItem>
         </PaginationContent>
       </Pagination>
     );
   }

Chart
-----

Data visualization component with locale-aware formatting and multiple chart types.

Usage
~~~~~

.. code-block:: typescript

   import { Chart, StatCard } from '@/components/ui/chart';

   // Bar chart
   <Chart
     title="Monthly Revenue"
     description="Revenue trends over the last 6 months"
     type="bar"
     data={[
       { label: 'Jan', value: 12000 },
       { label: 'Feb', value: 15000 },
       { label: 'Mar', value: 18000 },
     ]}
   />

   // Line chart
   <Chart
     title="User Growth"
     type="line"
     data={[
       { label: 'Q1', value: 1000 },
       { label: 'Q2', value: 1500 },
       { label: 'Q3', value: 2200 },
     ]}
   />

   // Pie chart
   <Chart
     title="User Distribution"
     type="pie"
     data={[
       { label: 'Admin', value: 5, color: '#3b82f6' },
       { label: 'Editor', value: 15, color: '#10b981' },
       { label: 'User', value: 80, color: '#f59e0b' },
     ]}
   />

Props
~~~~~

.. list-table::
   :header-rows: 1
   :widths: 20 20 20 40

   * - Prop
     - Type
     - Default
     - Description
   * - data
     - ChartDataPoint[]
     - required
     - Chart data points
   * - title
     - string
     - undefined
     - Chart title
   * - description
     - string
     - undefined
     - Chart description
   * - type
     - 'bar' \| 'line' \| 'pie' \| 'area'
     - 'bar'
     - Chart type
   * - height
     - number
     - 300
     - Chart height in pixels
   * - showGrid
     - boolean
     - true
     - Show grid lines
   * - showLegend
     - boolean
     - true
     - Show legend
   * - formatValue
     - (value: number) => string
     - undefined
     - Custom value formatter

Data Format
~~~~~~~~~~~

.. code-block:: typescript

   interface ChartDataPoint {
     label: string;    // Display label
     value: number;    // Numeric value
     color?: string;   // Optional custom color
   }

Locale-Aware Formatting
~~~~~~~~~~~~~~~~~~~~~~~

The Chart component automatically formats numbers according to the current locale:

.. code-block:: typescript

   // English: 1,234.56
   // German: 1.234,56
   // Swiss: 1'234.56

   // Custom formatting
   <Chart
     data={data}
     formatValue={(value) => 
       new Intl.NumberFormat(locale, {
         style: 'currency',
         currency: 'EUR'
       }).format(value)
     }
   />

StatCard
--------

Metrics display component with trend indicators and icons.

Usage
~~~~~

.. code-block:: typescript

   import { StatCard } from '@/components/ui/chart';

   <StatCard
     title="Total Users"
     value={2543}
     change={12}
     changeLabel="from last month"
     icon={<Users className="h-5 w-5 text-blue-600" />}
   />

   <StatCard
     title="Revenue"
     value="€45,231"
     change={-3}
     changeLabel="from last month"
   />

Props
~~~~~

.. list-table::
   :header-rows: 1
   :widths: 20 20 20 40

   * - Prop
     - Type
     - Default
     - Description
   * - title
     - string
     - required
     - Card title
   * - value
     - string \| number
     - required
     - Main value to display
   * - change
     - number
     - undefined
     - Percentage change
   * - changeLabel
     - string
     - undefined
     - Change description
   * - icon
     - React.ReactNode
     - undefined
     - Optional icon
   * - formatValue
     - (value: number) => string
     - undefined
     - Custom value formatter

Features
~~~~~~~~

* **Trend Indicators**: Automatic up/down arrows based on change value
* **Color Coding**: Green for positive, red for negative changes
* **Locale Formatting**: Numbers formatted according to current locale
* **Responsive Design**: Adapts to different screen sizes

Data Table Patterns
--------------------

Complete Data Table with Pagination
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   function CompleteDataTable() {
     const [currentPage, setCurrentPage] = useState(1);
     const [pageSize] = useState(10);
     const [sortField, setSortField] = useState('name');
     const [sortDirection, setSortDirection] = useState('asc');

     const { data, totalPages, loading } = useTableData({
       page: currentPage,
       pageSize,
       sortField,
       sortDirection,
     });

     return (
       <div className="space-y-4">
         <Table>
           <TableHeader>
             <TableRow>
               <TableHead>
                 <SortableHeader
                   field="name"
                   currentField={sortField}
                   direction={sortDirection}
                   onSort={(field, direction) => {
                     setSortField(field);
                     setSortDirection(direction);
                   }}
                 >
                   Name
                 </SortableHeader>
               </TableHead>
               <TableHead>Email</TableHead>
               <TableHead>Role</TableHead>
               <TableHead>Actions</TableHead>
             </TableRow>
           </TableHeader>
           <TableBody>
             {loading ? (
               <TableRow>
                 <TableCell colSpan={4} className="text-center">
                   Loading...
                 </TableCell>
               </TableRow>
             ) : (
               data.map((item) => (
                 <TableRow key={item.id}>
                   <TableCell>{item.name}</TableCell>
                   <TableCell>{item.email}</TableCell>
                   <TableCell>{item.role}</TableCell>
                   <TableCell>
                     <Button variant="ghost" size="sm">Edit</Button>
                   </TableCell>
                 </TableRow>
               ))
             )}
           </TableBody>
         </Table>

         <Pagination
           currentPage={currentPage}
           totalPages={totalPages}
           onPageChange={setCurrentPage}
         />
       </div>
     );
   }

Dashboard Metrics Grid
~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   function MetricsGrid() {
     const metrics = [
       {
         title: 'Total Users',
         value: 2543,
         change: 12,
         icon: <Users className="h-5 w-5 text-blue-600" />,
       },
       {
         title: 'Revenue',
         value: '€45,231',
         change: 8,
         icon: <DollarSign className="h-5 w-5 text-green-600" />,
       },
       {
         title: 'Orders',
         value: 1234,
         change: -3,
         icon: <ShoppingCart className="h-5 w-5 text-orange-600" />,
       },
       {
         title: 'Growth Rate',
         value: '12.5%',
         change: 2,
         icon: <TrendingUp className="h-5 w-5 text-purple-600" />,
       },
     ];

     return (
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {metrics.map((metric, index) => (
           <StatCard key={index} {...metric} />
         ))}
       </div>
     );
   }

Internationalization
--------------------

Data components support internationalization for:

* **Number Formatting**: Locale-specific number formats
* **Date Formatting**: Locale-specific date formats  
* **Currency Formatting**: Locale-specific currency display
* **Text Content**: Translatable labels and descriptions

.. code-block:: typescript

   import { useLocale, useTranslations } from 'next-intl';

   function LocalizedDataTable() {
     const locale = useLocale();
     const t = useTranslations('table');

     const formatCurrency = (value: number) => {
       return new Intl.NumberFormat(locale, {
         style: 'currency',
         currency: 'EUR',
       }).format(value);
     };

     return (
       <Table>
         <TableHeader>
           <TableRow>
             <TableHead>{t('name')}</TableHead>
             <TableHead>{t('revenue')}</TableHead>
           </TableRow>
         </TableHeader>
         <TableBody>
           {data.map((item) => (
             <TableRow key={item.id}>
               <TableCell>{item.name}</TableCell>
               <TableCell>{formatCurrency(item.revenue)}</TableCell>
             </TableRow>
           ))}
         </TableBody>
       </Table>
     );
   }

Accessibility
-------------

Data components follow WCAG 2.1 AA guidelines:

* **Table Structure**: Proper table headers and captions
* **Keyboard Navigation**: Full keyboard support for interactive elements
* **Screen Readers**: ARIA labels and descriptions
* **Focus Management**: Logical focus order
* **Color Independence**: Information not conveyed by color alone

Table Accessibility
~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   <Table>
     <TableCaption>
       User data table with {data.length} entries
     </TableCaption>
     <TableHeader>
       <TableRow>
         <TableHead scope="col">Name</TableHead>
         <TableHead scope="col">Email</TableHead>
       </TableRow>
     </TableHeader>
     <TableBody>
       {data.map((user) => (
         <TableRow key={user.id}>
           <TableCell>{user.name}</TableCell>
           <TableCell>{user.email}</TableCell>
         </TableRow>
       ))}
     </TableBody>
   </Table>

Chart Accessibility
~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   <Chart
     title="Monthly Revenue"
     data={data}
     aria-label="Bar chart showing monthly revenue from January to June"
   />

Performance
-----------

Data components are optimized for performance:

* **Virtual Scrolling**: For large datasets
* **Memoization**: Expensive calculations are memoized
* **Lazy Loading**: Data loaded on demand
* **Debounced Interactions**: Search and filter inputs are debounced

.. code-block:: typescript

   // Memoized chart data processing
   const processedData = useMemo(() => {
     return data.map(item => ({
       ...item,
       formattedValue: formatValue(item.value),
     }));
   }, [data, formatValue]);

   // Virtual scrolling for large tables
   const VirtualizedTable = ({ data }: { data: any[] }) => {
     return (
       <FixedSizeList
         height={400}
         itemCount={data.length}
         itemSize={50}
       >
         {({ index, style }) => (
           <div style={style}>
             <TableRow data={data[index]} />
           </div>
         )}
       </FixedSizeList>
     );
   };

Testing
-------

Data components include comprehensive tests:

* **Rendering**: Components render correctly with various data
* **Sorting**: Table sorting works correctly
* **Pagination**: Pagination navigation works as expected
* **Accessibility**: ARIA attributes and keyboard navigation
* **Internationalization**: Locale-specific formatting works correctly
