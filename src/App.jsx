// componente principal de la app
import { useEffect, useState } from "react";
import Header from "./components/Header";
import Guitar from "./components/Guitar";
import { db } from "./data/db";

function App() {

  /**
   * leer si hay elementos en el localstorage
   * @returns 
   */
  const initialCart = () => {
    const localStorageCart = localStorage.getItem('cart') // retorna un valor o null
    return localStorageCart ? JSON.parse(localStorageCart) : [] // inicio del state cart
  }
  
  // states
  const [data] = useState(db) // lo iniciamos asi, por ser una bd local
  const [cart, setCart] = useState(initialCart)

  const MAX_GUITARS = 5
  const MIN_GUITARS = 1

  // almacenar en localstorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  /**
   * Agregar un elemento al carrito
   * @param {*objGuitar Objeto de la guitarra clickeada} objGuitar 
   */
  function addToCart(objGuitar) {

    // validar si existe la guitarra en el carrito
    const guitarExist = cart.findIndex(guitar => guitar.id === objGuitar.id) // sacar el indice del obj en el array

    if (guitarExist >= 0) { // existe en el carrito
      
      // validar el maximo de la guitarra
      if (cart[guitarExist].quantity === MAX_GUITARS) return

      // actualizar el contador sin mutar el state
      const updateCart = [...cart] // primero una copia del state
      updateCart[guitarExist].quantity++ // sumar uno a la guitarra clickeada
      setCart(updateCart) // setear el nuevo state

    } else {

      objGuitar.quantity = 1 // agregamos un contador
      setCart([...cart, objGuitar])

    }
  }

  /**
   * Eliminar un elemento del carrito
   * @param {*id ID del carrito} id 
   */
  function removeFromCart(id) {
    setCart(prevCart => cart.filter(guitar => guitar.id !== id)) // setear el nuevo state
  }

  /**
   * Agregar guitarras del carrito
   * @param {*id ID del carrito} id 
   */
  function increaseQuantity (id) {

    // actualizar el contador sin mutar el state
    const updateCart = cart.map(guitar => {

      if (guitar.id === id && guitar.quantity < MAX_GUITARS) {
        return {
          ...guitar,
          quantity: guitar.quantity + 1
        }
      }

      return guitar
    })

    setCart(updateCart) // setear el nuevo state

  }

  /**
   * Eliminar guitarras del carrito
   * @param {*id ID del carrito} id 
   */
  function decreaseQuantity (id) {
    // actualizar el contador sin mutar el state
    const updateCart = cart.map(guitar => {

      if (guitar.id === id && guitar.quantity > MIN_GUITARS) {
        return {
          ...guitar,
          quantity: guitar.quantity - 1
        }
      }

      return guitar
    })

    setCart(updateCart) // setear el nuevo state

  }

  /**
   * Limpiar el carrito
   */
  function clearCart() {
    setCart([])
  }

  return (
    <>
      <Header cart={cart} 
              removeFromCart={removeFromCart} 
              increaseQuantity={increaseQuantity}
              decreaseQuantity={decreaseQuantity}
              clearCart={clearCart}
      ></Header> {/*Componente de header*/}

      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          {data.map(guitar => (
            <Guitar key={guitar.id} guitar={guitar} setCart={setCart} addToCart={addToCart}></Guitar> // Componente de cada guitarra
          ))}
        </div>
      </main>

      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0">
            GuitarLA - Todos los derechos Reservados
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;
