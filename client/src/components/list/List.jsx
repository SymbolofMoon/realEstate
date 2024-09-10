import './list.scss'
import CardSaved from"../cardsaved/CardSaved"

function List({posts}){
  console.log(posts);
  return (
    <div className='list'>
      {posts.map(item=>(
        // <Card key={item.id} item={item}/>
        <CardSaved itemId={item.id} />
      ))}
    </div>
  )
}

export default List