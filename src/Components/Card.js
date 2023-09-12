import './Card.css'

export default function Card({ name, tagline, image }) {
    return (
        <div className="card">
            <div className="cardImageContainer">
                <img
                    src={image}
                    alt={name}
                />
            </div>
            <div className='cardDetails'>
                <p>{tagline}</p>
                <h3>{name}</h3>
            </div>
        </div>
    );
}