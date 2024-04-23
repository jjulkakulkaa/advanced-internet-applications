function Bag(props) {
    return <li>{props.name}</li>; 
  }
  
  function Bags(props) {
    const bags = props.list;
    return (
        <div>
            <ol>
                {bags.map(bag => 
                    <Bag key={bag} name={bag} />
                )}
            </ol>
        </div>
    );
  }

export default Bags;