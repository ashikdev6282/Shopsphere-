// src/layouts/StoreLayout.jsx
import Footer from '../components/layout/Footer';
import Header from '../components/layout/header';


const StoreLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default StoreLayout;
