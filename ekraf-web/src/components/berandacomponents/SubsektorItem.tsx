type SubsektorItemProps = {
  name: string;
  image: string;
};

export const SubsektorItem = ({ name, image }: SubsektorItemProps) => {
  return (
    <div className="subsektor-card" data-pr-tooltip={name}>
      <div className="subsektor-avatar">
        <img src={image} alt={name} />
      </div>
      <span className="subsektor-name">{name}</span>
    </div>
  );
};
