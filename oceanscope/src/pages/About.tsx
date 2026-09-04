import { Waves, Database, Globe, Users, Target, Zap, ArrowRight, Link as LinkIcon, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import './About.css';

export default function About() {
  return (
    <div className="about-page">
      <div className="about-header">
        <div className="header-content">
          <div className="header-title">
            <Waves className="header-icon" />
            <h1>About OceanScope</h1>
          </div>
          <p className="header-subtitle">
            Transforming complex ocean data into interactive 3D experiences for research and education
          </p>
        </div>
      </div>

      <div className="about-content">
        {/* Mission Section */}
        <section className="mission-section">
          <div className="section-header">
            <h2 className="section-title">Our Mission</h2>
            <p className="section-subtitle">
              OceanScope aims to democratize oceanographic data visualization, making complex marine data accessible and understandable for researchers, students, policymakers, and the general public.
            </p>
          </div>
        </section>

        {/* Problem Statement */}
        <section className="problem-section">
          <div className="section-content">
            <div className="section-icon">
              <Target />
            </div>
            <h2 className="section-title">The Problem</h2>
            <div className="section-grid">
              <div className="problem-card">
                <h3>Data Complexity</h3>
                <p>Oceanographic data is inherently complex, multi-dimensional, and difficult to interpret without specialized tools and expertise.</p>
              </div>
              <div className="problem-card">
                <h3>Accessibility Gap</h3>
                <p>Most ocean data visualization tools require extensive training and are not accessible to students, policymakers, or the general public.</p>
              </div>
              <div className="problem-card">
                <h3>Data Fragmentation</h3>
                <p>Ocean data from multiple sources (INCOIS, Copernicus, Argo, satellites) exists in silos, making integrated analysis challenging.</p>
              </div>
              <div className="problem-card">
                <h3>Limited Interactivity</h3>
                <p>Traditional visualization methods are static and don't allow users to explore data dynamically or gain insights intuitively.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="solution-section">
          <div className="section-content">
            <div className="section-icon">
              <Zap />
            </div>
            <h2 className="section-title">Our Solution</h2>
            <div className="solution-grid">
              <div className="solution-card">
                <div className="card-icon">
                  <Waves />
                </div>
                <h3>Interactive 3D Visualization</h3>
                <p>Immersive 3D ocean surface and depth visualization powered by Three.js and React Three Fiber.</p>
              </div>
              <div className="solution-card">
                <div className="card-icon">
                  <Database />
                </div>
                <h3>Multi-source Integration</h3>
                <p>Seamless integration of data from INCOIS, Copernicus Marine, Argo floats, satellites, and ocean models.</p>
              </div>
              <div className="solution-card">
                <div className="card-icon">
                  <Globe />
                </div>
                <h3>Geographic Mapping</h3>
                <p>Interactive geographic visualization covering Indian Ocean, Arabian Sea, and Bay of Bengal regions.</p>
              </div>
              <div className="solution-card">
                <div className="card-icon">
                  <Zap />
                </div>
                <h3>AI-Powered Insights</h3>
                <p>Automated detection of anomalies, upwelling zones, temperature variations, and other oceanographic phenomena.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="technology-section">
          <div className="section-content">
            <h2 className="section-title">Technology Stack</h2>
            <div className="tech-grid">
              <div className="tech-item">
                <h3>Frontend</h3>
                <p>React, TypeScript, Vite, Three.js, React Three Fiber, Drei</p>
              </div>
              <div className="tech-item">
                <h3>Data Processing</h3>
                <p>NetCDF parsing, CSV/JSON processing, Geospatial analysis</p>
              </div>
              <div className="tech-item">
                <h3>Visualization</h3>
                <p>WebGL, 3D rendering, Interactive controls, Real-time animation</p>
              </div>
              <div className="tech-item">
                <h3>Data Sources</h3>
                <p>INCOIS, Copernicus Marine, Argo Program, Satellite observations</p>
              </div>
            </div>
          </div>
        </section>

        {/* Target Users Section */}
        <section className="users-section">
          <div className="section-content">
            <div className="section-icon">
              <Users />
            </div>
            <h2 className="section-title">Target Users</h2>
            <div className="users-grid">
              <div className="user-card">
                <h3>Researchers</h3>
                <p>Marine scientists and oceanographers studying ocean dynamics, climate patterns, and marine ecosystems.</p>
              </div>
              <div className="user-card">
                <h3>Students</h3>
                <p>Oceanography students and educators learning about marine systems and data analysis techniques.</p>
              </div>
              <div className="user-card">
                <h3>Policymakers</h3>
                <p>Government officials and decision-makers needing accessible ocean data for policy and planning.</p>
              </div>
              <div className="user-card">
                <h3>Data Analysts</h3>
                <p>Professionals working with oceanographic data for fisheries, shipping, environmental monitoring, and more.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Future Scope Section */}
        <section className="future-section">
          <div className="section-content">
            <h2 className="section-title">Future Scope</h2>
            <div className="future-list">
              <div className="future-item">
                <div className="future-marker">1</div>
                <div className="future-content">
                  <h3>Real-time Data Integration</h3>
                  <p>Live data streaming from ocean buoys, satellites, and automated monitoring systems.</p>
                </div>
              </div>
              <div className="future-item">
                <div className="future-marker">2</div>
                <div className="future-content">
                  <h3>Advanced Analytics</h3>
                  <p>Machine learning models for predictive analysis, anomaly detection, and pattern recognition.</p>
                </div>
              </div>
              <div className="future-item">
                <div className="future-marker">3</div>
                <div className="future-content">
                  <h3>Collaboration Features</h3>
                  <p>Shared workspaces, annotations, and collaborative analysis tools for research teams.</p>
                </div>
              </div>
              <div className="future-item">
                <div className="future-marker">4</div>
                <div className="future-content">
                  <h3>Mobile Applications</h3>
                  <p>Native mobile apps for field data collection and on-the-go data visualization.</p>
                </div>
              </div>
              <div className="future-item">
                <div className="future-marker">5</div>
                <div className="future-content">
                  <h3>API Integration</h3>
                  <p>RESTful APIs for programmatic access to OceanScope data and visualization capabilities.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <Waves className="cta-icon" />
            <h2 className="cta-title">Ready to Explore?</h2>
            <p className="cta-description">
              Start using OceanScope today to transform how you visualize and analyze oceanographic data.
            </p>
            <div className="cta-buttons">
              <Link to="/explorer" className="cta-btn primary">
                Launch Explorer
                <ArrowRight />
              </Link>
              <Link to="/datasets" className="cta-btn secondary">
                Browse Datasets
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-section">
          <div className="contact-content">
            <h2 className="contact-title">Connect With Us</h2>
            <div className="contact-links">
              <a href="#" className="contact-link">
                <LinkIcon />
                <span>GitHub</span>
              </a>
              <a href="#" className="contact-link">
                <Mail />
                <span>Contact Us</span>
              </a>
            </div>
            <p className="contact-info">
              Built for INCOIS/SIH 2026 Hackathon
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}