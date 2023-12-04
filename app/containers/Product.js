import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import _ from "lodash";
import {GetProductList} from "../actions/productAction";

const Product = (props) => {
    
    const dispatch = useDispatch();
    const productList = useSelector(state => state.ProductList);

    const productName = props.match.params.product;

    const [search, setSearch] = useState("");

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
            {productName}
        </div>
    )

}

export default Product;