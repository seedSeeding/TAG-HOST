import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useStateContext } from "../Providers/ContextProvider";
import { useEffect, useState } from 'react';
import { PatternApi } from '../Api/PatternService';
import StatusGLoveModal from "../DesignerUtentils/StatusGLoveModal";
import StatusHatModal from "../DesignerUtentils/StatusHatModal";
import StatusScarfModal from "../DesignerUtentils/StatusScarfModal";
export default function NotificationBox({ notifications }) {
    const [modalData, setModalData] = useState(null);
    const [modal, setModal] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const getSizeID = (size) => {

        size = size.toLowerCase();
        if (size === "all") {
            return 5;
        }

        return size === "small" ? 1 : size === "medium" ? 2 : size === "large" ? 3 : 4;
    };
    const patternAPi = new PatternApi();
    const HandleOpenModal = (textF, sizeF) => {
        const pattern_number = String(textF).split(" ")[1];
        const size_id = getSizeID(sizeF);

        const getUserData = async (pattern_number) => {

            try {
                const res = await patternAPi.getPatternByPN(pattern_number);
                // setData(res[0]);
                console.log(res)
                if (res) {
                    handleModalOpen(res[0][res[0].category][size_id - 1], res[0]);
                }



            } catch (error) {
                setModal([]);
                setModalData([]);
                setIsModalOpen(false);
                alert("The data could not be found or may have been removed.");
                console.error("Error fetching user data:", error);
            } finally {

            }
        };
        getUserData(pattern_number);

    }
    const handleModalClose = () => {
        setIsModalOpen(prev => !prev);
    };
    const handleModalOpen = (data, category) => {
        // console.log("data:::::",category);
        if (data.submitted) {
            setModal(category);
            setModalData(data);
            setIsModalOpen(true);
        }
    };

    return (
        <div className="bg-[#373839] p-2 shadow-md rounded-lg notification">
            <div className="flex items-center justify-center gap-2  pb-2 mb-4">
                <div className="text-xl font-semibold text-white">Notifications</div>
                <FontAwesomeIcon icon={faBell} className="text-[#ECB22E] text-xl" />
            </div>
            <div className="notification-body">
                {notifications && notifications.map((notification, index) => (
                    <div
                        key={index}
                        onClick={() => HandleOpenModal(notification.message, notification.size)}
                        className={`flex notification-row p-1 items-center space-x-1 mb-3 border rounded-xl ${notification.is_read ? "mark-as-read" : "mark-as-not-read"}`}
                    >
                        <img
                            src={`/storage/${notification.user_image}`}
                            alt="profile"
                            className="w-12 h-12 rounded-full object-cover notification-user"
                        />
                        <div className="flex-1 ">
                            <span className="notification-account-name block">
                                {notification['user'].first_name} {notification['user'].last_name}
                            </span>
                            <span className="text-sm max-w">
                                {notification.message}
                            </span>
                            <span className="text-sm  block">Size: {notification.size}</span>
                        </div>
                        <span className="text-xs text-[#414141]">{notification.time_ago}</span>
                    </div>
                ))}
            </div>
            {isModalOpen && (
                modal.category === "gloves" ? (
                    <StatusGLoveModal patternData={modal} sizeData={modalData} onClose={handleModalClose} />
                ) : modal.category === "hats" ? (
                    <StatusHatModal patternData={modal} sizeData={modalData} onClose={handleModalClose} />
                ) : modal.category === "scarves" ? (
                    <StatusScarfModal patternData={modal} sizeData={modalData} onClose={handleModalClose} />
                ) : null
            )}
        </div>
    );
}
