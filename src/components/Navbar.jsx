import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
    const location = useLocation();
    const routes = {
        '/dashboard': 'Tableau de bord',
        '/employes': 'Gérer les employés',
    };

    // Récupérer le nom de la page courante à partir de l'URL
    const currentPath = location.pathname;
    const pageTitle = routes[currentPath] || 'Page';
    return (
        <nav
            className="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl"
            id="navbarBlur"
            navbar-scroll="true"
        >
            <div className="container-fluid py-1 px-3">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                        <li className="breadcrumb-item text-sm">
                            <Link className="opacity-5 text-dark">
                                Pages
                            </Link>
                        </li>
                        <li
                            className="breadcrumb-item text-sm text-dark active"
                            aria-current="page"
                        >
                            {pageTitle}
                        </li>
                    </ol>
                    <h6 className="font-weight-bolder mb-0">{pageTitle}</h6>
                </nav>
                <div
                    className="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4"
                    id="navbar"
                >
                    <div className="ms-md-auto pe-md-3 d-flex align-items-center">
                        <div className="input-group">
                            <span className="input-group-text text-body">
                                <i className="fas fa-search" aria-hidden="true" />
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Type here..."
                            />
                        </div>
                    </div>
                    <ul className="navbar-nav  justify-content-end">
                        <li className="nav-item d-flex align-items-center">
                            <a
                                href="javascript:;"
                                className="nav-link text-body font-weight-bold px-0"
                            >
                                <i className="fa fa-user me-sm-1" />
                                <span className="d-sm-inline d-none">Sign In</span>
                            </a>
                        </li>
                        <li className="nav-item d-xl-none ps-3 d-flex align-items-center">
                            <a
                                href="javascript:;"
                                className="nav-link text-body p-0"
                                id="iconNavbarSidenav"
                            >
                                <div className="sidenav-toggler-inner">
                                    <i className="sidenav-toggler-line" />
                                    <i className="sidenav-toggler-line" />
                                    <i className="sidenav-toggler-line" />
                                </div>
                            </a>
                        </li>
                        <li className="nav-item px-3 d-flex align-items-center">
                            <a href="javascript:;" className="nav-link text-body p-0">
                                <i className="fa fa-cog fixed-plugin-button-nav cursor-pointer" />
                            </a>
                        </li>
                        <li className="nav-item dropdown pe-2 d-flex align-items-center">
                            <a
                                href="javascript:;"
                                className="nav-link text-body p-0"
                                id="dropdownMenuButton"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <i className="fa fa-bell cursor-pointer" />
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
