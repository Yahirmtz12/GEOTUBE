// frontend/src/components/Layout.js
import React, { useState, useEffect } from 'react'; // Importamos useEffect
import Navbar from './Navbar';
import Sidebar from './Sidebar';

// El script de Site24x7 que se insertará en el <head>
const RUM_SCRIPT_CONTENT = `
(function(w,d,s,r,k,h,m){
    if(w.performance && w.performance.timing && w.performance.navigation && !w.s247r) {
        w[r] = w[r] || function(){(w[r].q = w[r].q || []).push(arguments)};
        h=d.createElement('script');h.async=true;h.setAttribute('src',s+k);
        d.getElementsByTagName('head')[0].appendChild(h);
        (m = window.onerror),(window.onerror = function (b, c, d, f, g) {
        m && m(b, c, d, f, g),g || (g = new Error(b)),(w[r].q = w[r].q || []).push(["captureException",g]);})
    }
})(window,document,'//static.site24x7rum.com/beacon/site24x7rum-min.js?appKey=','s247r','4c1a8d3ad93b0bc9640a2ee2a6abd08f');
`;

const Layout = ({ user, onLogout, children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Efecto para insertar el script RUM al cargar el componente
    useEffect(() => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        // Usamos innerHTML o textContent para asignar el contenido del script
        script.textContent = RUM_SCRIPT_CONTENT;
        
        // Lo insertamos en el <head> del documento
        document.getElementsByTagName('head')[0].appendChild(script);

        // Opcional: Función de limpieza si el componente se desmonta (aunque el RUM suele quedarse)
        return () => {
            // No hacemos la limpieza aquí para asegurar que el script se mantenga
        };
    }, []); // El array vacío asegura que solo se ejecute una vez al montar

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="layout-container">
            <Navbar user={user} onLogout={onLogout} onToggleSidebar={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
            <main className={`main-content ${isSidebarOpen ? 'shifted' : ''}`}>
                {children} {/* Aquí se renderizará el contenido de la ruta actual */}
            </main>
        </div>
    );
};

export default Layout;