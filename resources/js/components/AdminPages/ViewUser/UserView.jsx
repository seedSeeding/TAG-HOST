import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import NotifCard from '../../Notifications/NotifCard';
import apiService from '../../services/apiService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBackward } from '@fortawesome/free-solid-svg-icons';
export default function UserView(props) {

    const { account, setOpenAccount } = props;
    const [userData, setFormData] = useState({
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
    });


    useEffect(() => {
        if (account) {
            setUserId(account.id)
            setFormData({
                last_name: account.last_name || '',
                first_name: account.first_name || '',
                middle: account.middle || '',
                email: account.email || '',
                address: account.address || '',
                number: account.number || '',
                age: account.age || '',
                log_id: account.log_id || '',
                password: account.password || '',
                confirmPassword: account.confirmPassword || '',
                role: account.role || 'Senior Fashion Designer',
                image: account.image || ''
            });
        }
    }, [account]);


    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null);
    const [message, setMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);


    const validateForm = () => {
        const { last_name, first_name, email, number, age, password, confirmPassword } = userData;
        if (!last_name || !first_name || !email || !number || !age) {
            setError('Please fill in all required fields.');
            return false;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setError('Please enter a valid email address.');
            return false;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return false;
        }
        setError('');
        return true;
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSelectedImage(file);
        setFormData((prev) => ({
            ...prev,
            image: file.name
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const formData = new FormData();
        formData.append('id', account.id)

        formData.append("last_name", userData.last_name);
        formData.append("first_name", userData.first_name);
        formData.append("middle", userData.middle);
        formData.append("email", userData.email);
        formData.append("address", userData.address);
        formData.append("number", userData.number);
        formData.append("age", userData.age);
        formData.append("log_id", userData.log_id);
        formData.append("password", userData.password);
        formData.append("role", userData.role);


        if (selectedImage) {
            formData.append('image', selectedImage);
        } else {

            formData.append('image', '');
        }

        try {
            const response = await apiService.post(`update-user`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                setMessage(response.data.message);
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Something went wrong');
        }
    };




    const handleDownloadDetails = async () => {
        const pdf = new jsPDF();

        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text("TAG\nGlobal Management Corporation", pdf.internal.pageSize.getWidth() / 2, 10, { align: 'center' });

        if (userData.image) {
            const imageFile = userData.image;


            if (imageFile instanceof Blob) {
                const reader = new FileReader();

                reader.onloadend = async () => {
                    const imgData = reader.result;

                    const imgWidth = 100;
                    const imgHeight = (imgWidth * 3) / 4;
                    const x = (pdf.internal.pageSize.getWidth() - imgWidth) / 2;

                    pdf.addImage(imgData, 'JPEG', x, 20, imgWidth, imgHeight);

                    pdf.setFont("helvetica", "normal");
                    pdf.setFontSize(12);
                    pdf.text("User Details:", 10, 20 + imgHeight + 10);

                    pdf.setFont("helvetica", "bold");
                    pdf.text("Last Name:", 10, 20 + imgHeight + 20);
                    pdf.setFont("helvetica", "normal");
                    pdf.text(userData.last_name, 60, 20 + imgHeight + 20);

                    pdf.setFont("helvetica", "bold");
                    pdf.text("First Name:", 10, 20 + imgHeight + 30);
                    pdf.setFont("helvetica", "normal");
                    pdf.text(userData.first_name, 60, 20 + imgHeight + 30);

                    pdf.setFont("helvetica", "bold");
                    pdf.text("Middle Initial:", 10, 20 + imgHeight + 40);
                    pdf.setFont("helvetica", "normal");
                    pdf.text(userData.middle, 60, 20 + imgHeight + 40);

                    pdf.setFont("helvetica", "bold");
                    pdf.text("Email:", 10, 20 + imgHeight + 50);
                    pdf.setFont("helvetica", "normal");
                    pdf.text(userData.email, 60, 20 + imgHeight + 50);

                    pdf.setFont("helvetica", "bold");
                    pdf.text("Address:", 10, 20 + imgHeight + 60);
                    pdf.setFont("helvetica", "normal");
                    pdf.text(userData.address, 60, 20 + imgHeight + 60);

                    pdf.setFont("helvetica", "bold");
                    pdf.text("Contact Number:", 10, 20 + imgHeight + 70);
                    pdf.setFont("helvetica", "normal");
                    pdf.text(userData.number, 60, 20 + imgHeight + 70);

                    pdf.setFont("helvetica", "bold");
                    pdf.text("Age:", 10, 20 + imgHeight + 80);
                    pdf.setFont("helvetica", "normal");
                    pdf.text(userData.age, 60, 20 + imgHeight + 80);

                    pdf.setFont("helvetica", "bold");
                    pdf.text("UserID:", 10, 20 + imgHeight + 90);
                    pdf.setFont("helvetica", "normal");
                    pdf.text(userData.log_id, 60, 20 + imgHeight + 90);

                    pdf.setFont("helvetica", "bold");
                    pdf.text("Role:", 10, 20 + imgHeight + 100);
                    pdf.setTextColor(0, 0, 255);
                    pdf.text(userData.role, 60, 20 + imgHeight + 100);
                    pdf.setTextColor(0, 0, 0);

                    pdf.save(`user_${userData.log_id}_details.pdf`);
                };

                reader.readAsDataURL(imageFile);
            } else {
                console.error("The provided image data is not a Blob.");
            }
        } else {
            pdf.text("User Details:", 10, 30);
            pdf.save(`user_${userData.log_id}_details.pdf`);
        }
    };

    const deleteAccount = async () => {
        try {
            const res = await apiService.delete(`users/${account.id}`);
            if (res.status === 200) {
                setMessage(res.data.status);
            }
        } catch (error) {
            setError(error.error);
        }
    }
    return (
        <>
            <div className="create-acc-container admin-page main">
                <button onClick={() => setOpenAccount(false)} className='font-bold text-[1.8rem] ml-4 hover:text-white'><FontAwesomeIcon icon={faArrowLeft} /></button>
                {message && (<NotifCard type={"s"} message={message} setMessage={setMessage} />)}
                {error && (<NotifCard type={"e"} message={error} setMessage={setError} />)}
                <form className="create-acc-form">
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
                        <div className="create-image-container">
                            <img src={selectedImage ? URL.createObjectURL(selectedImage) : `/storage/${userData.image}`} alt="User" />
                        </div>
                        {/* <a href={`/storage/profiles/ozjfwXDqTLoxkHAkFsofkv1hefrYbYdm0rCCxR3N.jpg`}>image</a> */}
                        <input type="file" id="image" className='user-update-image' onChange={handleImageChange} accept="image/*" />


                        <div className="create-id-row">
                            <input type="text" id='log_id1' value={userData.log_id} onChange={handleInputChange} placeholder="UserID" />
                            <label htmlFor="log_id1">UserID</label>
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
                            <input type="text" id='log_id2' value={userData.log_id} onChange={handleInputChange} />
                            <label htmlFor="log_id2">LogID</label>
                        </div>

                        <div className="create-password-row">
                            <input type="password" id="password" value={userData.password} onChange={handleInputChange} />
                            <label htmlFor="password">New Password</label>
                        </div>

                        <div className="create-c-password-row">
                            <input type="password" id="confirmPassword" value={userData.confirmPassword} onChange={handleInputChange} />
                            <label htmlFor="confirmPassword">Confirm Password</label>
                        </div>
                    </div>

                    <div className="create-box">
                        <button type="button" className="create-btn update-btn" onClick={handleUpdate}>Update Account</button>
                        <button type="button" className="create-btn save-btn" onClick={deleteAccount}>Delete Account</button>
                        <button type="button" className="create-btn dl-btn" onClick={handleDownloadDetails}>Download Detail</button>
                    </div>
                </form>
            </div>
        </>
    );
}
