import React, { useEffect, Fragment, useState } from "react";
import SizeHelper from "../Utils/utils.js"

const url = process.env.REACT_APP_BACKEND_URL;

function CategoryView(props) {

    const[categories,setCategories] = useState([{color:'',name:''}]);
    const[delBtn, setDelBtn] = useState('');

    const mySize = new SizeHelper(props.size);

    useEffect(() =>{
        const getCategories = async() => {
            const response = await fetch(`${url}api/v1/calendar/category`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
              });
    
              const data = await response.json();
              if (data.status === "success") {
                setCategories(data.data.category);
              } else {
                alert(response.message);
              }
        }
        getCategories();
    },[setCategories])


    const addCategory = async(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const objData = Object.fromEntries(formData.entries())
        const jsonData = JSON.stringify(objData);
        

        const response = await fetch(`${url}api/v1/calendar/category`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: jsonData,
        });
    
        const data = await response.json();
        if (data.status === "success") {
            setCategories([...categories,objData]);
        } else {
          alert(response.message);
        }
      }

  // Delete post API
  const delCategory = async (categoryId) => {
    
    if(!window.confirm("Are you sure to delete the category?")){
      return;
    }

    const response = await fetch(`${url}api/v1/calendar/category/${categoryId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await response;
    if (data.status === 204) {
      const updateCategories = categories.filter(item => item._id !== categoryId);
      setCategories(updateCategories);
    }
    else{
      alert('something wrong...')
    }

  }

    function getTextColor(hex) {
        // 將 HEX 顏色轉為 RGB
        let r = parseInt(hex.substring(1, 3), 16);
        let g = parseInt(hex.substring(3, 5), 16);
        let b = parseInt(hex.substring(5, 7), 16);
    
        // 計算亮度 (YIQ公式)
        let brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
        // 如果亮度較低（較暗），使用白色字；否則使用黑色字
        return brightness < 128 ? "#ffffff" : "#000000";
      }


    return(
        <div className = 'categoryView' style={{width:"100%",display:"flex",justifyContent:"center",height:"20vh",marginTop:"3%",marginBottom:"-2%"}}>
            <div className = 'categoryView' id='view' >
                <div  className = 'categoryView' id = 'categoryList' >
                    {
                        categories.map((item) =>(
                            <Fragment key={item._id}>
   
                            <button className="categoryView categories" style={{backgroundColor:item.color, color:getTextColor(item.color), fontSize:mySize.adjust(0.02)}} onMouseEnter={()=>setDelBtn(item._id)} onMouseLeave={()=>setDelBtn('')}>                       
                                { delBtn === item._id && 
                            <button className="categoryView delBtn" id={item._id} onClick={()=>delCategory(item._id)}> X </button>
                                }
                            {item.name} 
                                </button>
                            </Fragment>
                        ))
                    }
                    <form className="categoryView" id='addCategory' onSubmit={addCategory}>
                        <input type='color' className="categoryView" id='inputColor' style={{width:mySize.adjust(0.03),height:mySize.adjust(0.035)}} name='color'></input>
                        <input type='text' className="categoryView" 
                        id='inputCategory' placeholder="+ new category" style={{fontSize:mySize.adjust(0.02)}} name='name'></input>
                    </form>
                </div>
                <div className = 'categoryView' id = 'itemList'>
                    <div className="categoryView item" id='item_1' style={{fontSize:mySize.adjust(0.02)}}> item_1 </div>
                </div>
            </div>
        </div>
    )
}

export default CategoryView;