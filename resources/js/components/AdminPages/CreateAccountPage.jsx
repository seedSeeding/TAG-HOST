import { useState } from 'react';
import apiService from '../services/apiService';
import NotifCard from '../Notifications/NotifCard';

export default function CreateAccountPage() {
    const [data, setData] = useState();
    const [imageView, setImageView] = useState('');
    const initialFormData = {
        last_name: '',
        first_name: '',
        middle: '',
        email: '',
        address: '',
        number: '',
        age: '',
        log_id: '',
        password: '',
        confirmPassword: '',
        role: 'Senior Fashion Designer',
        image: ''
    };
    const [userData, setFormData] = useState(initialFormData);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleChooseFile = () => {
        document.getElementById('profile-input').click();
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImageView(URL.createObjectURL(file));
        if (file) {
            setFormData((prev) => ({
                ...prev,
                image: file,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (userData.password !== userData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const formPayload = new FormData();
        Object.keys(userData).forEach((key) => {
            formPayload.append(key, userData[key]);
        });

        try {
            const response = await apiService.post('users', formPayload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                setMessage('Account created successfully');
                setFormData(initialFormData); // Reset form data
                setImageView(''); // Clear image preview
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong');
        }
    };

    return (
        <>
            <div className="create-acc-container admin-page main">
                {message && (<NotifCard type={"s"} message={message} setMessage={setMessage} />)}
                {error && (<NotifCard type={"e"} message={error} setMessage={setError} />)}
                <form onSubmit={handleSubmit} className="create-acc-form">
                    <div className="create-box">

                        <div className="create-form-row">
                            <div className="create-input-row lastname">
                                <input type="text" id="last_name" value={userData.last_name} onChange={handleInputChange} placeholder="Last Name" />
                                <label htmlFor="last_name">Last Name</label>
                            </div>

                            <div className="create-input-row firstname">
                                <input type="text" id="first_name" value={userData.first_name} onChange={handleInputChange} placeholder="First Name" />
                                <label htmlFor="first_name">First Name</label>
                            </div>

                            <div className="create-input-row mi">
                                <input type="text" id="middle" value={userData.middle} onChange={handleInputChange} placeholder="MI" />
                                <label htmlFor="middle">MI</label>
                            </div>
                        </div>

                        <div className="create-form-row">
                            <div className="create-input-row email">
                                <input type="email" id="email" value={userData.email} onChange={handleInputChange} placeholder="Email" />
                                <label htmlFor="email">Email</label>
                            </div>
                        </div>

                        <div className="create-form-row">
                            <div className="create-input-row address">
                                <input type="text" id="address" value={userData.address} onChange={handleInputChange} placeholder="Address" />
                                <label htmlFor="address">Address</label>
                            </div>
                        </div>

                        <div className="create-form-row">
                            <div className="create-input-row contact">
                                <input type="text" id="number" value={userData.number} onChange={handleInputChange} placeholder="Contact #" />
                                <label htmlFor="number">Contact #</label>
                            </div>

                            <div className="create-input-row age">
                                <input type="text" id="age" value={userData.age} onChange={handleInputChange} placeholder="Age" />
                                <label htmlFor="age">Age</label>
                            </div>
                        </div>
                    </div>

                    <div className="create-box">
                        <div className="create-image-container" onClick={handleChooseFile}>
                            {imageView ? (
                                <img src={imageView} alt="Selected" />
                            ) : (
                                <img src="/Images/openImage.png" alt="imagesymbol" />
                            )}
                            <input type="file" className="create-image" id="profile-input" onChange={handleFileChange} />
                        </div>

                        <div className="create-id-row">
                            <input type="text" id='log_id' value={userData.log_id} onChange={handleInputChange} placeholder="UserID" />
                            <label htmlFor="log_id">UserID</label>
                        </div>

                        <div className="create-role-select">
                            <select id="role" value={userData.role} onChange={handleInputChange}>
                                <option value="Senior Fashion Designer">Senior Fashion Designer</option>
                                <option value="Pattern Maker">Pattern Maker</option>
                            </select>
                            <label htmlFor="role">Role</label>
                        </div>
                    </div>

                    <div className="create-box">
                        <div className="create-log-row">
                            <input type="text" id='log_id' value={userData.log_id} onChange={handleInputChange} placeholder="Enter LogID" />
                            <label htmlFor="log_id">LogID</label>
                        </div>

                        <div className="create-password-row">
                            <input type="password" id="password" value={userData.password} onChange={handleInputChange} placeholder='Enter Password' />
                            <label htmlFor="password">Password</label>
                        </div>

                        <div className="create-c-password-row">
                            <input type="password" id="confirmPassword" value={userData.confirmPassword} onChange={handleInputChange} placeholder='Confirm Password' />
                            <label htmlFor="confirmPassword">Confirm Password</label>
                        </div>
                    </div>

                    <div className="create-box">
                        <button type="submit" className="create-btn save-btn">Save Account</button>
                    </div>
                </form>
            </div>
        </>
    );
}
