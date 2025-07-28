import "../styles/navBar.css";

function NavBar() {
  return (
    <div className="navBar">
      <div className="actionsContainer">
        <div className="crossIcon actions">
          <img src="/cross.png" />
        </div>
        <div className="minimizer actions">
          {" "}
          <img src="/minimize.png" />{" "}
        </div>
        <div className="maximizer actions">
          {" "}
          <img src="/maximize.png" />{" "}
        </div>
      </div>
    </div>
  );
}

export default NavBar;
