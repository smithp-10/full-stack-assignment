import React from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const FilterPanel = ({
    filterInput,
    setFilterInput,
    selectedCategories,
    setSelectedCategories,
    selectedSubcategories,
    setSelectedSubcategories,
    priceRange,
    setPriceRange,
    dateRange,
    setDateRange,
    togglePanel
}) => {
    return (
        <div className="filter-panel">
            <button onClick={togglePanel}>Close</button>
            <h2>Filter Options</h2>
            <input
                value={filterInput}
                onChange={e => setFilterInput(e.target.value)}
                placeholder="Search by name..."
            />

            <Select
                isMulti
                options={[
                    { value: 'Category1', label: 'Category 1' },
                    { value: 'Category2', label: 'Category 2' },
                    // Add more categories as needed
                ]}
                onChange={setSelectedCategories}
                placeholder="Select categories..."
            />

            <Select
                isMulti
                options={[
                    { value: 'Subcategory1', label: 'Subcategory 1' },
                    { value: 'Subcategory2', label: 'Subcategory 2' },
                    // Add more subcategories as needed
                ]}
                onChange={setSelectedSubcategories}
                placeholder="Select subcategories..."
            />

            <div>
                <label>Price Range:</label>
                <input
                    type="range"
                    min={0}
                    max={500} // Set this to your maximum price
                    value={priceRange[0]}
                    onChange={e => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                />
                <input
                    type="range"
                    min={0}
                    max={500} // Set this to your maximum price
                    value={priceRange[1]}
                    onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                />
                <span>{priceRange[0]} - {priceRange[1]}</span>
            </div>

            <div>
                <label>Date Range:</label>
                <DatePicker
                    selected={dateRange[0]}
                    onChange={date => setDateRange([date, dateRange[1]])}
                    selectsStart
                    startDate={dateRange[0]}
                    endDate={dateRange[1]}
                    placeholderText="Select start date"
                />
                <DatePicker
                    selected={dateRange[1]}
                    onChange={date => setDateRange([dateRange[0], date])}
                    selectsEnd
                    startDate={dateRange[0]}
                    endDate={dateRange[1]}
                    placeholderText="Select end date"
                />
            </div>
        </div>
    );
};

export default FilterPanel;
