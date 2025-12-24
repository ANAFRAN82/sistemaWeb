import { useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import ProductsPage, { categories as allCategories } from './components/ProductsPage'; // Importar categories del componente ProductsPage
import CategoryPage, { categories as catCategories, products as catProducts } from './components/CategoryPage'; // Importar categories y products del componente CategoryPage
import CompanyPage from './components/CompanyPage';
import ContactPage from './components/ContactPage';
import Footer from './components/Footer';

// NOTA: Se eliminó la importación: import { categories, products, companyInfo } from './data/mockData';
// Esto asume que los datos están integrados en los componentes hijos (como ProductsPage, CategoryPage).

// **************** ASUMIMOS DATOS DE CONFIGURACIÓN BÁSICOS PARA COMPANYPAGE ****************
// Si CompanyPage aún requiere companyInfo, tienes dos opciones:
// 1. Integrarlo en CompanyPage.js
// 2. Definirlo aquí temporalmente (como se muestra a continuación):
const companyInfo = {
  mission: 'Ser líderes en la fabricación y distribución de productos de limpieza biodegradables.',
  values: ['Innovación', 'Sustentabilidad', 'Calidad', 'Servicio al Cliente'],
  history: 'Fundada en 2005, comenzamos con una pequeña línea de detergentes y crecimos hasta cubrir la línea industrial y automotriz.'
};
// *******************************************************************************************


function App() {
  const [currentPage, setCurrentPage] = useState('home');
  // Eliminamos la anotación de tipo: <string | null>
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleNavigate = (page) => { // Eliminamos la anotación de tipo: (page: string)
    setCurrentPage(page);
    setSelectedCategory(null);
  };

  const handleCategoryClick = (slug) => { // Eliminamos la anotación de tipo: (slug: string)
    if (slug === 'all') {
      setCurrentPage('products');
      setSelectedCategory(null);
    } else {
      setCurrentPage('category');
      setSelectedCategory(slug);
    }
  };

  const handleBackToProducts = () => {
    setCurrentPage('products');
    setSelectedCategory(null);
  };

  const renderPage = () => {
    // Para HomePage y ProductsPage, usamos la lista de categorías del componente ProductsPage.
    const categoriesToPass = allCategories; 
    
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            categories={categoriesToPass}
            onCategoryClick={handleCategoryClick}
            onNavigate={handleNavigate}  
          />
        );

      case 'products':
        return (
          // ProductsPage ya no necesita la prop 'categories' si las tiene integradas.
          // Si tu versión final de ProductsPage aún acepta la prop, déjala.
          <ProductsPage
            categories={categoriesToPass} 
            onCategoryClick={handleCategoryClick}
          />
        );

      case 'category':
        // Buscamos la categoría y productos de las exportaciones del CategoryPage.js
        const categoriesData = catCategories;
        const productsData = catProducts;

        // Se mantiene la lógica de filtrado aquí para pasar solo lo necesario a CategoryPage
        const category = categoriesData.find(c => c.slug === selectedCategory) || null;
        const categoryProducts = productsData.filter(p => p.categoryId === category?.id);
        
        return (
          // CategoryPage ya no necesita las props 'category' y 'products' si ya tiene el slug.
          // El componente CategoryPage que creaste espera 'categorySlug'.
          <CategoryPage
            categorySlug={selectedCategory} // Ajuste para el componente CategoryPage que me diste
            onBack={handleBackToProducts}
          />
        );

      case 'company':
        return <CompanyPage companyInfo={companyInfo} />;

      case 'contact':
        return <ContactPage />;

      default:
        return (
          <HomePage
            categories={categoriesToPass}
            onCategoryClick={handleCategoryClick}
            onNavigate={handleNavigate}
          />
        );
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />

      <div style={{ flexGrow: 1 }}>
        {renderPage()}
      </div>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;