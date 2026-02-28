import { useGame } from '../contexts/GameContext';
import './Notification.css';

const Notification = () => {
    const { notification } = useGame();

    if (!notification) return null;

    return (
        <div className="notification">
            {notification}
        </div>
    );
};

export default Notification;
