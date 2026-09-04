import { Link } from 'react-router-dom';
import { Waves, Activity, Database, Zap, Globe, TrendingUp, Shield, ArrowRight } from 'lucide-react';
import './Home.css';

const Home = () => {
  const stats = [
    { value: '6', label: 'Ocean Parameters', icon: Activity },
    { value: '156', label: 'Observation Points', icon: Globe },
    { value: '2000m', label: 'Max Depth', icon: Waves },
    { value: '7', label: 'Data Sources', icon: Database },
  ];

  const capabilities = [
    {
      icon: Zap,
      title: 'Real-time Visualization',
      description: 'Transform complex ocean data into interactive 3D visualizations with real-time updates and smooth animations.'
    },
    {
      icon: Database,
      title: 'Multi-source Integration',
      description: 'Seamlessly integrate data from INCOIS, Copernicus, Argo floats, satellite observations, and ocean models.'
    },
    {
      icon: Waves,
      title: '3D Depth Analysis',
      description: 'Explore ocean parameters across multiple depth levels with intuitive 3D profiling and cross-section views.'
    },
    {
      icon: TrendingUp,
      title: 'Forecast Comparison',
      description: 'Compare observational data with model forecasts to identify anomalies and improve prediction accuracy.'
    },
    {
      icon: Shield,
      title: 'Scientific Insights',
      description: 'AI-powered detection of oceanographic phenomena like upwelling zones, temperature anomalies, and algal blooms.'
    },
    {
      icon: Globe,
      title: 'Geographic Analysis',
      description: 'Comprehensive geographic visualization covering the Indian Ocean, Arabian Sea, and Bay of Bengal regions.'
    }
  ];

  const workflowSteps = [
    { step: '1', title: 'Data Sources', description: 'INCOIS, Copernicus, Argo, Satellite' },
    { step: '2', title: 'Processing', description: 'Quality control & normalization' },
    { step: '3', title: '3D Visualization', description: 'Interactive ocean surface & depth' },
    { step: '4', title: 'Analysis', description: 'Parameter comparison & trends' },
    { step: '5', title: 'Insights', description: 'Scientific discoveries & alerts' }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="ocean-gradient"></div>
          <div className="particle-field"></div>
          <div className="grid-overlay"></div>
        </div>
        
        <div className="container hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <Waves className="badge-icon" />
              <span>INCOIS/SIH 2026</span>
            </div>
            
            <h1 className="hero-title">
              <span className="gradient-text">OceanScope</span>
              <br />
              <span className="hero-subtitle">Interactive 3D Ocean Data Visualization</span>
            </h1>
            
            <p className="hero-description">
              Transform complex oceanographic data into immersive 3D experiences. 
              Explore temperature, salinity, chlorophyll, currents, and more across 
              the Indian Ocean with real-time visualization and scientific insights.
            </p>
            
            <div className="hero-cta">
              <Link to="/explorer" className="btn btn-primary">
                <Activity className="btn-icon" />
                Explore Ocean
                <ArrowRight className="btn-arrow" />
              </Link>
              <Link to="/datasets" className="btn btn-secondary">
                <Database className="btn-icon" />
                View Data
              </Link>
            </div>

            {/* Floating Data Indicators */}
            <div className="floating-indicators">
              <div className="indicator indicator-1">
                <div className="indicator-value">24.8°C</div>
                <div className="indicator-label">Surface Temp</div>
              </div>
              <div className="indicator indicator-2">
                <div className="indicator-value">35.2 PSU</div>
                <div className="indicator-label">Salinity</div>
              </div>
              <div className="indicator indicator-3">
                <div className="indicator-value">2.8 mg/m³</div>
                <div className="indicator-label">Chlorophyll</div>
              </div>
            </div>
          </div>

          {/* 3D Preview Placeholder */}
          <div className="hero-visual">
            <div className="ocean-preview">
              <div className="preview-surface"></div>
              <div className="preview-depth"></div>
              <div className="preview-grid"></div>
              <div className="preview-particles"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Why OceanScope Section */}
      <section className="capabilities-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why OceanScope?</h2>
            <p className="section-subtitle">
              Advanced oceanographic visualization designed for researchers, marine scientists, and policymakers
            </p>
          </div>

          <div className="capabilities-grid">
            {capabilities.map((capability, index) => (
              <div key={index} className="capability-card">
                <div className="capability-icon">
                  <capability.icon />
                </div>
                <h3 className="capability-title">{capability.title}</h3>
                <p className="capability-description">{capability.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">
                  <stat.icon />
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="workflow-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Data Workflow</h2>
            <p className="section-subtitle">
              From raw oceanographic data to actionable scientific insights
            </p>
          </div>

          <div className="workflow-container">
            {workflowSteps.map((step, index) => (
              <div key={index} className="workflow-step">
                <div className="step-number">{step.step}</div>
                <div className="step-content">
                  <h4 className="step-title">{step.title}</h4>
                  <p className="step-description">{step.description}</p>
                </div>
                {index < workflowSteps.length - 1 && (
                  <div className="step-connector">
                    <ArrowRight />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <Waves className="cta-icon" />
            <h2 className="cta-title">Ready to Explore Ocean Data?</h2>
            <p className="cta-description">
              Start your journey into oceanographic visualization with OceanScope. 
              Access comprehensive datasets, interactive 3D tools, and AI-powered insights.
            </p>
            <div className="cta-buttons">
              <Link to="/explorer" className="btn btn-primary btn-lg">
                Launch Explorer
                <ArrowRight className="btn-arrow" />
              </Link>
              <Link to="/about" className="btn btn-secondary btn-lg">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;