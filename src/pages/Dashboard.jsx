import React from 'react';

function Dashboard() {
    return (
        <div className="pc-container">
            <div className="pc-content">
                {/* [ breadcrumb ] start */}
                <div className="page-header">
                    <div className="page-block">
                        <div className="row align-items-center">
                            <div className="col-md-12">
                                <div className="page-header-title">
                                    <h5 className="m-b-10">Dashboard</h5>
                                </div>
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="/dashboard">Home</a></li>
                                    <li className="breadcrumb-item"><a href="#">Dashboard</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                {/* [ breadcrumb ] end */}

                {/* [ Main Content ] start */}
                <div className="row">
                    {/* Ajoutez ici le contenu spécifique de votre tableau de bord (les cartes, les graphiques, etc.) */}
                    <div className="col-md-6 col-xl-3">
                        <div className="card">
                            <div className="card-body">
                                <h6 className="mb-2 f-w-400 text-muted">Total Page Views</h6>
                                <h4 className="mb-3">4,42,236 <span className="badge bg-light-primary border border-primary"><i
                                    className="ti ti-trending-up"></i> 59.3%</span></h4>
                                <p className="mb-0 text-muted text-sm">You made an extra <span className="text-primary">35,000</span> this year
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* ... autres éléments du tableau de bord ... */}
                </div>
                {/* [ Main Content ] end */}
            </div>
        </div>
    );
}

export default Dashboard;