import { useEffect, useState } from 'react';
import { UserAPI } from '../Api/UserApi';
import UserView from './ViewUser/UserView';

export default function AccountListPage() {
    const [array, setArray] = useState(Array(20).fill(null));
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [filtered, setFiltered] = useState([]);
    const [filterRole, setFilterRole] = useState('all'); 
    const [ascendingOrder, setAscendingOrder] = useState('asc'); 
    const [searchVal,setSearchVal] = useState("");
    const [openAccount, setOpenAccount] = useState(false);
    const userApi = new UserAPI();
    const [selectedAccount, setSelectedAccount] = useState();

    useEffect(() => {
        const fetchUsers = async () => {
            setError('');
            try {
                const users = await userApi.getUsers();
                setUsers(users);
                setFiltered(users);
            } catch (error) {
                setError(error.message || 'An error occurred while fetching users');
            }
        };
        fetchUsers();
    }, []);

    const handleSelectAccount = (account) => {
        setSelectedAccount(account);
        setOpenAccount(true);
    };

    useEffect(() => {
        let filteredUsers = filterRole !== "all" ? users.filter((user) => user.role === filterRole) : [...users];
        
       
        if (searchVal) {
            filteredUsers = filteredUsers.filter((user) => 
                user.first_name.toLowerCase().includes(searchVal.toLowerCase()) ||
                user.last_name.toLowerCase().includes(searchVal.toLowerCase())
            );
        }
        
     
        filteredUsers.sort((a, b) => {
            if (ascendingOrder === 'asc') {
                return a.last_name.localeCompare(b.last_name);
            } else if (ascendingOrder === 'desc') {
                return b.last_name.localeCompare(a.last_name); 
            }
            return 0;
        });
        
        setFiltered(filteredUsers);
    }, [filterRole, ascendingOrder, users, searchVal]); 


    return (
        <>
            {
                !openAccount && (
                    <div className="admin-page account-list-page">
                        <div className="acc-list-header">
                            <div className="acc-total">
                                Total Accounts
                            </div>
                            <span className="acc-total-text">{filtered.length}</span>
                            <div className="acc-search-con">
                                <svg
                                    width={46}
                                    height={46}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M11 3a8 8 0 1 0 0 16 8 8 0 1 0 0-16z" />
                                    <path d="m21 21-4.35-4.35" />
                                </svg>
                                <input type="text" placeholder="Search here.." value={searchVal} onChange={(e) => setSearchVal(e.target.value)}/>
                            </div>
                        </div>
                        <div className="acc-filter-con">
                            <select name="roleFilter" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                                <option className="filter-option" value="all">All Accounts</option>
                                <option className="filter-option" value="Senior Fashion Designer">Senior Fashion Designer</option>
                                <option className="filter-option" value="Pattern Maker">Pattern Maker</option>
                            </select>
                            
                            <select name="order" value={ascendingOrder} onChange={(e) => setAscendingOrder(e.target.value)}>
                                <option className="filter-option" value="asc">Ascending Order</option>
                                <option className="filter-option" value="desc">Descending Order</option>
                            </select>
                        </div>
                        <div className="acc-list-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Role</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>LogID</th>
                                        <th>Password</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="spacer-row"><td colSpan="5"></td></tr>
                                    {filtered.map((data) => (
                                        <tr key={data.id} onClick={() => handleSelectAccount(data)}>
                                            <td>{data.role}</td>
                                            <td>{`${data.last_name}, ${data.first_name}`}</td>
                                            <td>{data.email}</td>
                                            <td>{data.log_id}</td>
                                            <td>*************</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            }
            {
                openAccount && (
                    <UserView account={selectedAccount} setOpenAccount={setOpenAccount} />
                )
            }
        </>
    );
}
