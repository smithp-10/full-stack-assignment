import React, { useState, useMemo } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import FilterPanel from './FilterPanel'; // Ensure this import is correct
import Fuse from 'fuse.js';
import './DataTable.css'; // Add your CSS file

const DataTable = ({ data }) => {
    const [filterInput, setFilterInput] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedSubcategories, setSelectedSubcategories] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 500]);
    const [dateRange, setDateRange] = useState([null, null]);
    const [isFilterPanelVisible, setIsFilterPanelVisible] = useState(false);

    // Initialize fuse with data and options
    const fuse = useMemo(() => new Fuse(data, {
        keys: ['name'],
        threshold: 0.3,
    }), [data]); // Use data as dependency for fuse

    // Memoize the filtered data based on the applied filters
    const filteredData = useMemo(() => {
        const searchResults = filterInput ? fuse.search(filterInput).map(result => result.item) : data;

        const categoryFiltered = selectedCategories.length > 0
            ? searchResults.filter(item => selectedCategories.includes(item.category))
            : searchResults;

        const subcategoryFiltered = selectedSubcategories.length > 0
            ? categoryFiltered.filter(item => selectedSubcategories.includes(item.subcategory))
            : categoryFiltered;

        const priceFiltered = subcategoryFiltered.filter(item => {
            return item.price >= priceRange[0] && item.price <= priceRange[1];
        });

        const dateFiltered = priceFiltered.filter(item => {
            const createdAt = new Date(item.createdAt);
            return (
                (dateRange[0] ? createdAt >= dateRange[0] : true) &&
                (dateRange[1] ? createdAt <= dateRange[1] : true)
            );
        });

        return dateFiltered;
    }, [filterInput, selectedCategories, selectedSubcategories, priceRange, dateRange, fuse, data]); // Include data as a dependency

    // Define table columns
    const columns = useMemo(() => [
        { Header: 'Name', accessor: 'name' },
        { Header: 'Category', accessor: 'category' },
        { Header: 'Subcategory', accessor: 'subcategory' },
        { Header: 'Price', accessor: 'price' },
        {
            Header: 'Created At',
            accessor: 'createdAt',
            Cell: ({ value }) => new Date(value).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }),
        },
        {
            Header: 'Updated At',
            accessor: 'updatedAt',
            Cell: ({ value }) => new Date(value).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }),
        },
    ], []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        { columns, data: filteredData, initialState: { pageIndex: 0 } },
        useSortBy,
        usePagination
    );

    const toggleFilterPanel = () => {
        setIsFilterPanelVisible(prevState => !prevState);
        console.log("Filter Panel Visibility: ", !isFilterPanelVisible); // Debug log
    };

    return (
        <div className="data-table-container">
            <button onClick={toggleFilterPanel} className="toggle-filter-button">
                {isFilterPanelVisible ? 'Hide Filters' : 'Show Filters'}
            </button>

            {isFilterPanelVisible && (
                <FilterPanel
                    filterInput={filterInput}
                    setFilterInput={setFilterInput}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    selectedSubcategories={selectedSubcategories}
                    setSelectedSubcategories={setSelectedSubcategories}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    togglePanel={toggleFilterPanel}
                />
            )}

            <table {...getTableProps()} className="data-table">
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map(row => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div className="pagination-controls">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </button>
                <button onClick={previousPage} disabled={!canPreviousPage}>
                    {'<'}
                </button>
                <button onClick={nextPage} disabled={!canNextPage}>
                    {'>'}
                </button>
                <button onClick={() => gotoPage(pageOptions.length - 1)} disabled={!canNextPage}>
                    {'>>'}
                </button>
                <span>
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{' '}
                </span>
                <select
                    value={pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.value));
                    }}
                >
                    {[5, 10, 20, 30, 40].map(size => (
                        <option key={size} value={size}>
                            Show {size}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default DataTable;
