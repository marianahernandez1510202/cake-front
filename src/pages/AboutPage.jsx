import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { Link } from 'react-router-dom';
import { FaLeaf, FaHeart, FaStar, FaRecycle } from 'react-icons/fa';

const AboutPage = () => {
  return (
    <div className="about-page">
      <Navbar />
      
      <main className="about-content">
        <section className="about-hero">
          <div className="container">
            <h1 className="about-title">Sobre SweetCake</h1>
            <p className="about-subtitle">
              Deliciosa pastelería artesanal con más de 10 años endulzando momentos especiales.
            </p>
          </div>
        </section>
        
        <section className="about-story">
          <div className="container">
            <div className="story-container">
              <div className="story-image">
                <img 
                  src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                  alt="Nuestra pastelería" 
                  className="rounded-img"
                />
              </div>
              <div className="story-text">
                <h2>Nuestra Historia</h2>
                <p>
                  SweetCake nació en 2013 como un pequeño emprendimiento familiar con la visión de crear pasteles y postres 
                  que no solo fueran deliciosos sino también obras de arte. Comenzamos en una pequeña cocina casera 
                  y hoy contamos con tres sucursales en la ciudad.
                </p>
                <p>
                  Nuestra filosofía siempre ha sido utilizar ingredientes de la más alta calidad, apoyar a productores 
                  locales y crear recetas que combinen lo tradicional con toques modernos e innovadores.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="about-values">
          <div className="container">
            <h2 className="section-title">Nuestros Valores</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">
                  <FaLeaf className="icon" />
                </div>
                <h3>Calidad</h3>
                <p>
                  Seleccionamos cuidadosamente cada ingrediente y supervisamos cada paso de nuestro proceso de elaboración.
                </p>
              </div>
              
              <div className="value-card">
                <div className="value-icon">
                  <FaHeart className="icon" />
                </div>
                <h3>Pasión</h3>
                <p>
                  Amamos lo que hacemos y eso se refleja en cada uno de nuestros productos.
                </p>
              </div>
              
              <div className="value-card">
                <div className="value-icon">
                  <FaStar className="icon" />
                </div>
                <h3>Innovación</h3>
                <p>
                  Constantemente experimentamos con nuevos sabores, técnicas y presentaciones.
                </p>
              </div>
              
              <div className="value-card">
                <div className="value-icon">
                  <FaRecycle className="icon" />
                </div>
                <h3>Sostenibilidad</h3>
                <p>
                  Utilizamos envases biodegradables y apoyamos prácticas de comercio justo.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="about-team">
          <div className="container">
            <h2 className="section-title">Nuestro Equipo</h2>
            <div className="team-grid">
              <div className="team-member">
                <div className="member-image">
                  <img src="https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Chef principal" />
                </div>
                <h3>María Rodríguez</h3>
                <p className="member-role">Chef Principal</p>
                <p className="member-bio">
                  Graduada de Le Cordon Bleu con más de 15 años de experiencia en pastelería francesa.
                </p>
              </div>
              
              <div className="team-member">
                <div className="member-image">
                  <img src="https://images.unsplash.com/photo-1583394293214-28ded15ee548?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Chef de pasteles" />
                </div>
                <h3>Carlos Mendoza</h3>
                <p className="member-role">Chef de Pasteles</p>
                <p className="member-bio">
                  Especialista en esculturas de chocolate y diseños personalizados.
                </p>
              </div>
              
              <div className="team-member">
                <div className="member-image">
                  <img src="https://images.unsplash.com/photo-1581299894007-aaa50297cf16?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Chef de postres" />
                </div>
                <h3>Ana Gómez</h3>
                <p className="member-role">Chef de Postres</p>
                <p className="member-bio">
                  Experta en repostería sin gluten y alternativas para dietas especiales.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="about-gallery">
          <div className="container">
            <h2 className="section-title">Nuestra Pastelería</h2>
            <div className="gallery-grid">
              <div className="gallery-item">
                <img src="https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Pastelería" />
              </div>
              <div className="gallery-item">
                <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Pasteles" />
              </div>
              <div className="gallery-item">
                <img src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Postres" />
              </div>
              <div className="gallery-item">
                <img src="https://images.unsplash.com/photo-1571115177098-24ec42ed204d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Cupcakes" />
              </div>
            </div>
          </div>
        </section>
        
        <section className="about-contact">
          <div className="container">
            <h2 className="section-title">Visítanos</h2>
            <div className="locations-grid">
              <div className="location-card">
                <h3>Sucursal Principal</h3>
                <p>Av. Constitución 742, Centro</p>
                <p>Tel: (33) 3456-7890</p>
                <p>Lunes a Sábado: 9:00 AM - 8:00 PM</p>
                <p>Domingo: 10:00 AM - 6:00 PM</p>
              </div>
              
              <div className="location-card">
                <h3>Sucursal Norte</h3>
                <p>Plaza Real Local 24, Zona Norte</p>
                <p>Tel: (33) 2345-6789</p>
                <p>Lunes a Sábado: 10:00 AM - 9:00 PM</p>
                <p>Domingo: 11:00 AM - 7:00 PM</p>
              </div>
              
              <div className="location-card">
                <h3>Sucursal Sur</h3>
                <p>Av. López Mateos 1234, Zona Sur</p>
                <p>Tel: (33) 3456-5678</p>
                <p>Lunes a Sábado: 9:00 AM - 8:00 PM</p>
                <p>Domingo: Cerrado</p>
              </div>
            </div>
            
            <div className="contact-cta">
              <h3>¿Preguntas o pedidos especiales?</h3>
              <p>Estamos aquí para ayudarte a crear momentos dulces inolvidables.</p>
              <Link to="/contact" className="btn-primary">Contáctanos</Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;