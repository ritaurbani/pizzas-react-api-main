const apiUrl = import.meta.env.VITE_API_URL;

function Card({pizza, onCancel}) { //fai console.log con props

    return (

        <div className="card">
            <img src={`http://localhost:3001/${pizza.image}`} alt="" />
            <div className="card-body">
                <h4>{pizza.name}</h4>
                {/* //se non ci sono ingredienti non dare nulla */}
                <div>{pizza.ingredients && pizza.ingredients.map((curIngredient, index) => (
                    <span key={index}>{curIngredient}</span>
                ))}</div>
                <button onClick={onCancel} className="btn btn-danger">Cancella</button>
            </div>
        </div>
    )
}

export default Card