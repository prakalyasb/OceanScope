import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const LoadingSpinner = ({ size = 'md', color = '#00d4ff' }: LoadingSpinnerProps) => {
  return (
    <div className={`loading-spinner loading-spinner-${size}`} style={{ '--spinner-color': color } as React.CSSProperties}>
      <div className="spinner-ring"></div>
      <div className="spinner-ring"></div>
      <div className="spinner-ring"></div>
    </div>
  );
};

export default LoadingSpinner;