import React, { useEffect, useState } from 'react';
import GlassSurface from '../components/GlassSurface';
import { useNavigate } from 'react-router-dom';
import exit from '../assets/exit.png'
import * as XLSX from 'xlsx';


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
    const user = JSON.parse(localStorage.getItem('user'));

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (!file) {
            setFileName('');
            setExcelData({});
            return;
        }
        setFileName(file.name);

        const reader = new FileReader();
        reader.onload = (evt) => {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheets = {};
            workbook.SheetNames.forEach((sheetName) => {
                const worksheet = workbook.Sheets[sheetName];
                sheets[sheetName] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
            });
            setExcelData(sheets);
        };
        reader.readAsArrayBuffer(file);
    };

    return (<>
        <div className='flex flex-row items-center'><h1 className="flex flex-row items-center justify-end text-xl font-bold text-white gap-2 text-underline z-50 absolute m-2 top-4 left-5">{user.Name}</h1>
            <button type="button" onClick={handleLogout} className="flex flex-row items-center justify-end font-bold text-white gap-2 text-underline cursor-pointer z-50 absolute m-2 top-4 right-5"><img src={exit} alt="backlogo" className="w-4 h-4" />LOGOUT</button></div>
        <div className="flex flex-row justify-center mt-28 absolute inset-0">
            <GlassSurface
                width={1400}
                height={70}
                borderRadius={24}
                className="my-custom-class"
            >
                <div className='flex flex-row justify-between items-center gap-220'>
                    <p className='text-white text-2xl font-bold'>Upload Your Excel File (.xlsx, .xls)</p>
                    <input
                        type='file'
                        id='file-upload'
                        className='hidden'
                        accept='.xlsx,.xls'
                        onChange={handleChange}
                    />
                    <label
                        htmlFor='file-upload'
                        className='bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600'
                    >
                        Choose File
                    </label>
                </div>
            </GlassSurface>
            {Object.keys(excelData).length > 0 && (
                <div className='flex flex-col  items-center mt-28 z-50 absolute inset-0'>
                    {Object.entries(excelData).map(([sheetName, rows]) => (
                        <GlassSurface
                            key={sheetName}
                            width={1400}
                            height={800}
                            borderRadius={24}
                            className="my-custom-class"
                        ><div className='flex flex-col gap-10 '>
                                <h2 style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold', marginBottom: 16 }}>{sheetName}</h2>
                                <div style={{ maxHeight: '450px', overflowY: 'auto', overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #4b5563' }}>
                                        <thead
                                            style={{
                                                backgroundColor: '#1f2937',
                                                position: 'sticky',
                                                top: 0,
                                                zIndex: 1,
                                            }}
                                        >
                                            <tr>
                                                {rows.length > 0 &&
                                                    Object.keys(rows[0]).map((header) => (
                                                        <th
                                                            key={header}
                                                            style={{
                                                                border: '1px solid #4b5563',
                                                                padding: '8px 16px',
                                                                color: 'white',
                                                                textAlign: 'left',
                                                                whiteSpace: 'nowrap',
                                                            }}
                                                        >
                                                            {header}
                                                        </th>
                                                    ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows.map((row, i) => (
                                                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#111827' : '#1f2937' }}>
                                                    {Object.values(row).map((val, idx) => (
                                                        <td
                                                            key={idx}
                                                            style={{
                                                                border: '1px solid #374151',
                                                                padding: '8px 12px',
                                                                color: 'white',
                                                                maxWidth: 300,
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                            }}
                                                            title={val ? val.toString() : ''}
                                                        >
                                                            {val}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </GlassSurface>
                    ))}
                </div>
            )}
        </div>
    </>
    );


}

export default Dashboard;