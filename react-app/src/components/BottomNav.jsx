import './BottomNav.css';

const BottomNav = () => {
    return (
        <div className="bottom-nav">
            <button className="nav-btn">妖盟</button>
            <button className="nav-btn">洞府</button>
            <button className="nav-btn active">砍树</button>
            <button className="nav-btn">挑战</button>
            <button className="nav-btn">冒险</button>
        </div>
    );
};

export default BottomNav;
