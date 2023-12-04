import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import _ from "lodash";
import {GetProductList} from "../actions/productAction";
import ReactPaginate from "react-paginate";

const ProductList = (props) => {

    const [search, setSearch] = useState("");
    const dispatch = useDispatch();
    const productList = useSelector(state => state.ProductList);

    React.useEffect(() => {
        fetchData(1)
    }, [])

    const fetchData = (page = 1) => {
        dispatch(GetProductList(page))
    }

    const showData = () => {

        if(!_.isEmpty(productList.data)) {

            return productList.data.map(el => {
                return <div>
                    <p>{el.name}</p>
                </div>
            })

        }

        if(productList.loading) {

            return <p>loading...</p>

        }

        if(productList.errorMsg !== "") {

            return <p>{productList.errorMsg}</p>

        }

        return <p>Unable to get data</p>

    }

    return (
        <div>
            <div>
                <input type="text" onChange={ e => setSearch(e.target.value) }/>
                {/* <button onClick={ () => {props.history.push(`/product/${search}`)} }>Search</button> */}
                <button onClick={ () => fetchData(1) }>Search</button>
            </div>
            {showData()}
            {!_.isEmpty(productList.data) && (
                <ReactPaginate/>
            )}
        </div>
    )

}

export default ProductList;