import React from 'react';
import DataTable from './components/DataTable';
import sampleData from './sampleData';

function App() {
    return (
        <div>
            <h1>Data Table</h1>
            <DataTable data={sampleData} />
        </div>
    );
}

export default App;