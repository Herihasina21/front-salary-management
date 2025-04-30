import React from 'react';

function Navbar() {
    return (
        <header className="pc-header">
            <div className="header-wrapper">
                <div className="me-auto pc-mob-drp">
                    <ul className="list-unstyled">
                        <li className="pc-h-item pc-sidebar-collapse">
                            <a href="#" className="pc-head-link ms-0" id="sidebar-hide">
                                <i className="ti ti-menu-2"></i>
                            </a>
                        </li>
                        <li className="pc-h-item pc-sidebar-popup">
                            <a href="#" className="pc-head-link ms-0" id="mobile-collapse">
                                <i className="ti ti-menu-2"></i>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="ms-auto">
                    <ul className="list-unstyled">
                        <li className="dropdown pc-h-item">
                            <a className="pc-head-link dropdown-toggle arrow-none me-0" data-bs-toggle="dropdown" href="#" role="button"
                                aria-haspopup="false" aria-expanded="false">
                                <i className="ti ti-mail"></i>
                            </a>
                        </li>
                        <li className="dropdown pc-h-item header-user-profile">
                            <a className="pc-head-link dropdown-toggle arrow-none me-0" data-bs-toggle="dropdown" href="#" role="button"
                                aria-haspopup="false" data-bs-auto-close="outside" aria-expanded="false">
                                <img src="../assets/images/user/avatar-2.jpg" alt="user-image" className="user-avtar" />
                                <span>Stebin Ben</span>
                            </a>
                            {/* Dropdown menu */}
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
