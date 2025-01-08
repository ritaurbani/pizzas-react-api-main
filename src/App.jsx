import { useEffect, useState } from "react";
import axios from "axios"
import Card from "./components/Card"

const apiUrl = import.meta.env.VITE_API_URL;

const initialData = {
  name:"",
  image:"",
}

function App() {
  const [menu, setMenu] = useState([]);
  const[formData, setFormData] = useState(initialData)
  const [ingredients, setIngredients] =useState([]) //quando i dati ci arrivano dali mettiamo qui
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    console.log("cambia")
    getPizzas(); //parte all avvio e al cambiamento del filter
  }, [filter]);

  useEffect(() => {    //prendere subito all`invio della pagina
    getIngredients();
  }, []);

  const getPizzas = () => {
    let url = `${apiUrl}/pizzas`
    if (filter!=="all"){
      url+=`?ingredient=filter`
    }
    axios.get(url).then((resp) => {
      console.log(resp.data.pizze)
      setMenu(resp.data.pizze)
    })
  };

  const getIngredients = () => {

    axios.get(`${apiUrl}/ingredients`).then((resp) => {
      console.log(resp)
      setIngredients(resp.data.ingredients)  //controlalre questo su console
    })
  }

  const handleInputChange = (event) => {
    // console.log(event.target.value);
    // console.log(event.target.name)
    const keyToChange = event.target.name
    const newData = {
      ...formData,
      [keyToChange] : event.target.value
    }
    setFormData(newData)
  }

  const handleFormSubmit = (event) => {
   event.preventDefault();
   console.log("submit", formData)
   axios.post(`${apiUrl}/pizzas`, formData).then((resp) => {
    console.log(resp.data);
    const newPizza = resp.data;
    const newMenu = [
      ...menu,
      newPizza
    ]
    setMenu(newMenu)
   })
  }

  const handleDelete = (id) => {
console.log("delete", id)
axios.delete(`${apiUrl}/pizzas/${id}`).then((resp) => {
  console.log(resp)
  //per cancellare anche in locale una volta avuti i dati
  const newMenu = menu.filter((curPizza)=> curPizza.id !== id)
  setMenu(newMenu)
})
}



  return (
    <>
      <div className="container">

      <section>
        <select name="ingredient" id=""  value={filter} onChange={(e) =>setFilter(event.target.value)}>
          <option value="all">Tutte</option>
          {ingredients.map((curIngredient, index)=> (
            <option key={index} value={curIngredient}>{curIngredient}</option>
          ))}
        </select>
      </section>

        <section>
          <h2>Le nostre pizze</h2>

          {menu.length > 0 ? (
            <div className="row row-cols-2 row-cols-lg-3">
              {menu.map((curItem) => (
                <div className="col" key={curItem.id}>
                <Card
                pizza={curItem}
                //onCancel={()=>{console.log("cancella")
                //quando arriva evento dal figlio e`invocata (click), non invochiamo noi direttamente
                onCancel={()=>{handleDelete(curItem.id)}}
                />

                </div>
              ))}
            </div>
          ) : (
            <p>Nessuna pizza presente</p>
          )}
        </section>

        <section>
          <h3>Aggiungi una nuova pizza</h3>
          <form onSubmit={handleFormSubmit}  action="">
            <div className="mb-3">
              <input 
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleInputChange} />
            </div>

            <div className="mb-3">
              <input 
              type="text"
              id="name"
              className="form-control"
              name="image"
              value={formData.image} 
              onChange={handleInputChange}/>
            </div>

            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
          
        </section>
      </div>
    </>
  );
}

export default App;
