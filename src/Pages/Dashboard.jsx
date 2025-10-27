import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import exit from '../assets/exit.png';
import GlassSurface from '../components/GlassSurface';
import ApiService from '../services/apiService';


function Dashboard() {
    const navigate = useNavigate();
    useEffect(() => {
        if (!localStorage.getItem('loggedIn')) {
            alert('Please login');
            navigate('/');
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('loggedIn');
        navigate('/');
    }

    const [fileName, setFileName] = React.useState('');
    const [excelData, setExcelData] = React.useState({});
    const [activeSheet, setActiveSheet] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [uploadSuccess, setUploadSuccess] = React.useState(false);
    const user = JSON.parse(localStorage.getItem('user'));

    const handleChange = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            setFileName('');
            setExcelData({});
            setActiveSheet('');
            setUploadSuccess(false);
            return;
        }
        
        setFileName(file.name);
        setLoading(true);
        setUploadSuccess(false);
        
        try {
            // Upload file to backend
            const response = await ApiService.uploadFile(file, user.user_id);
            
            // Set the data from backend response
            setExcelData(response.sheets_data);
            
            // Set first sheet as active by default
            if (response.sheets && response.sheets.length > 0) {
                setActiveSheet(response.sheets[0]);
            }
            
            setUploadSuccess(true);
            alert('File uploaded successfully!');
        } catch (error) {
            console.error('Upload error:', error);
            let errorMessage = 'Error uploading file: ' + error.message;
            
            // Provide more helpful error messages
            if (error.message.includes('Failed to process Excel file')) {
                errorMessage = 'The Excel file could not be processed. Please ensure:\n' +
                              '• The file is a valid Excel file (.xlsx or .xls)\n' +
                              '• The file is not corrupted\n' +
                              '• The file is not password protected\n' +
                              '• The file is not too large (max 16MB)';
            } else if (error.message.includes('Only Excel files are allowed')) {
                errorMessage = 'Please select a valid Excel file (.xlsx or .xls)';
            } else if (error.message.includes('No file selected')) {
                errorMessage = 'Please select a file to upload';
            }
            
            alert(errorMessage);
            setFileName('');
            setExcelData({});
            setActiveSheet('');
        } finally {
            setLoading(false);
        }
    };

    return (<>
        <div className='flex flex-row items-center'>
            <h1 className="flex flex-row items-center justify-end text-xl font-bold text-white gap-2 text-underline z-50 absolute m-2 top-4 left-5">
                {user.name}
            </h1>
            <button 
                type="button" 
                onClick={handleLogout} 
                className="flex flex-row items-center justify-end font-bold text-white gap-2 text-underline cursor-pointer z-50 absolute m-2 top-4 right-5 hover:opacity-80 transition-opacity"
            >
                <img src={exit} alt="backlogo" className="w-4 h-4" />
                LOGOUT
            </button>
        </div>
        
        <div className="flex flex-col items-center mt-28 px-4 pb-8">
            <GlassSurface
                width="min(1400px, 95vw)"
                height="auto"
                borderRadius={24}
                className="my-custom-class mb-8"
            >
                <div className='flex flex-col sm:flex-row justify-between items-center gap-4 p-4'>
                    <div className='flex flex-col gap-2'>
                        <p className='text-white text-xl sm:text-2xl font-bold text-center sm:text-left'>
                            Upload Your Excel File (.xlsx, .xls)
                        </p>
                        {fileName && (
                            <p className='text-gray-300 text-sm text-center sm:text-left'>
                                📄 {fileName}
                            </p>
                        )}
                    </div>
                    <input
                        type='file'
                        id='file-upload'
                        className='hidden'
                        accept='.xlsx,.xls'
                        onChange={handleChange}
                    />
                    <label
                        htmlFor='file-upload'
                        className={`bg-blue-500 text-white px-6 py-2.5 rounded-lg cursor-pointer hover:bg-blue-600 whitespace-nowrap transition-colors font-semibold shadow-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Uploading...' : 'Choose File'}
                    </label>
                </div>
            </GlassSurface>
            
            {Object.keys(excelData).length > 0 && (
                <div className='w-full' style={{ maxWidth: 'min(1400px, 95vw)' }}>
                    {/* Sheet Tabs */}
                    <div className='flex gap-2 mb-4 overflow-x-auto pb-2'>
                        {Object.keys(excelData).map((sheetName) => (
                            <button
                                key={sheetName}
                                onClick={() => setActiveSheet(sheetName)}
                                className={`px-6 py-2.5 rounded-t-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                                    activeSheet === sheetName
                                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
                                        : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700/70 border border-gray-700/50'
                                }`}
                            >
                                {sheetName}
                            </button>
                        ))}
                    </div>

                    {/* Active Sheet Content */}
                    {activeSheet && excelData[activeSheet] && (
                        <div className='rounded-2xl overflow-hidden backdrop-blur-md bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-gray-900/95 border border-gray-700/50 shadow-2xl'>
                            {/* Sheet Header */}
                            <div className='bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 border-b border-gray-700/50'>
                                <h2 className='text-white text-2xl font-bold flex items-center gap-3'>
                                    {activeSheet}
                                    <span className='text-sm text-gray-400 font-normal ml-2'>
                                        ({excelData[activeSheet].length} rows)
                                    </span>
                                </h2>
                            </div>

                            {/* Scrollable Table Container */}
                            <div 
                                className='overflow-auto custom-scrollbar'
                                style={{ 
                                    maxHeight: '600px',
                                    scrollbarWidth: 'thin',
                                    scrollbarColor: '#4B5563 #1F2937'
                                }}
                            >
                                <table className='w-full border-collapse'>
                                    <thead className='sticky top-0 z-20'>
                                        <tr className='bg-gradient-to-r from-gray-800 to-gray-900'>
                                            {excelData[activeSheet].length > 0 && 
                                                Object.keys(excelData[activeSheet][0]).map((key, idx) => (
                                                <th
                                                    key={idx}
                                                    className='border border-gray-700 px-4 py-3 text-left text-white font-bold whitespace-nowrap bg-gray-900/98 backdrop-blur-sm'
                                                    style={{ 
                                                        minWidth: '150px',
                                                        position: 'sticky',
                                                        top: 0
                                                    }}
                                                >
                                                    <div className='flex items-center gap-2'>
                                                        <span className='text-blue-400 text-xs'>▼</span>
                                                        {key}
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {excelData[activeSheet].map((row, i) => (
                                            <tr 
                                                key={i} 
                                                className={`${
                                                    i % 2 === 0 ? 'bg-gray-900/50' : 'bg-gray-800/50'
                                                } hover:bg-blue-900/20 transition-colors`}
                                            >
                                                {Object.values(row).map((val, idx) => (
                                                    <td
                                                        key={idx}
                                                        className='border border-gray-700/50 px-4 py-3 text-gray-100 overflow-hidden text-ellipsis'
                                                        style={{
                                                            minWidth: '150px',
                                                            maxWidth: '400px',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                        title={val ? val.toString() : ''}
                                                    >
                                                        {val !== '' ? val : <span className='text-gray-600'>—</span>}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Footer with info */}
                            <div className='bg-gray-900/80 px-6 py-3 border-t border-gray-700/50 flex justify-between items-center'>
                                <p className='text-gray-400 text-sm'>
                                    💡 Tip: Scroll horizontally and vertically to view all data
                                </p>
                                <p className='text-gray-400 text-sm'>
                                    Columns: {excelData[activeSheet].length > 0 ? Object.keys(excelData[activeSheet][0]).length : 0}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>

        <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
                width: 10px;
                height: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: #1F2937;
                border-radius: 5px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #4B5563;
                border-radius: 5px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #6B7280;
            }
        `}</style>
    </>
    );
}

export default Dashboard;
