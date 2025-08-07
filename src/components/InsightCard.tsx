
interface InsightCardProps {
  text: string;
}

const InsightCard = ({ text }: InsightCardProps) => {
  return (
    <div className="insight-card mb-8 animate-fade-in">
      <div className="flex items-start space-x-3">
        <div className="w-2 h-2 rounded-full bg-news-accent mt-3 flex-shrink-0"></div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-3">
            Insight del día
          </h3>
          <p className="text-text-primary leading-relaxed">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InsightCard;
