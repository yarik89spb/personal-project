import './Ticker.css';

interface TickerProps{
  text: string;
}

const Ticker = ({ text } : TickerProps) => {
  return (
    <div className="ticker-container">
      <div className="ticker-wrapper">
        <div className="ticker-text"> {text} </div>
      </div>
    </div>
  );
};

export default Ticker;