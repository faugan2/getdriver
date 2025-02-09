import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SearchIcon from '@material-ui/icons/Search';
import "../styles/recherche.scss";
import {useHistory} from "react-router";
import Drivers from "../components/Drivers";
import LocalTaxiIcon from '@material-ui/icons/LocalTaxi';
import DirectionsBusIcon from '@material-ui/icons/DirectionsBus';
import AirportShuttleIcon from '@material-ui/icons/AirportShuttle';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import {useState,useEffect} from "react";
import CloseIcon from '@material-ui/icons/Close';
import { bus, taxi, vehicule_leger, vehicule_lourd } from '../components/img';
import { selectUsers } from '../features/counterSlice';
import { useSelector } from 'react-redux';
import Pilote from "../components/Pilote";

const Recherche=()=>{
    const history=useHistory();
    const go_back = () => {
        history.push("/main");
    }
    const make_check=(e,id,titre,icon)=>{
      const btn=e.target;
      const option=document.querySelector("#option");
      let clone=<button style={{
          display:"flex",
          alignItems:"center",
          gap:"0.2rem",
          fontSize:"0.6rem",
          padding:"0.2rem",
          backgroundColor:"rgba(0,0,0,0)",
          border:"none",
          borderRadius:"5px",
          marginBottom:"0.2rem"
      }}>
          {icon}
          {/*titre*/}
      </button>;

     set_clone(clone);
     set_index(id);
    
    }

    const [clone,set_clone]=useState(null);
    const [index,set_index]=useState(0);
    
    const users=useSelector(selectUsers);
    const [pilotes,set_pilotes]=useState(users);
    const [pilotes_show,set_pilotes_show]=useState(users)
    const [search,set_search]=useState("");
    useEffect(()=>{
        if(users.length==0){
            history.replace("/");
            return;
        }
        const res=users.filter((user)=>{
            if(index==0){
                return user.type==2 && user.pilote!=undefined ;
            }else{
                return user.type==2 && user.pilote==index && user.pilote!=undefined;
            }
            
        })
        set_pilotes(res);
        set_pilotes_show(res);

    },[users,index]);

    useEffect(()=>{
        if(search==""){
            set_pilotes_show(pilotes);
            return;
        }
        const res=pilotes_show.filter((pilote)=>{
            return pilote.nom.toLowerCase().indexOf(search.toLowerCase())>=0;
        })

        set_pilotes_show(res);
    },[search])

    return(
        <div className="recherche">
            <div className="recherche_head">
                <div className="first">
                    <button onClick={go_back}>
                        <ArrowBackIcon />
                    </button>
                    <div>
                        <div id="option">{clone}</div>
                        <input type="text" placeholder="Rechercher..." 
                        autoFocus style={{fontSize:"0.8rem",color:"gray"}} 
                        onChange={e=>set_search(e.target.value)}
                        />
                        {index!=0 && <button style={{
                            border:"none",
                            outline:"none",
                            backgroundColor:"transparent",
                            color:"white",

                        }}
                        onClick={(e)=>{
                            set_index(0);
                            set_clone(null);
                        }}
                        >
                            <CloseIcon style={{fontSize:"1.2rem", color:"gray"}}/>
                        </button>
                        }
                        
                    </div>

                </div>
                <div className="second">
                   {index == 0 && <button onClick={e=>make_check(e,1,"Taxi",<img src={taxi} style={{width:25,height:25,resize:"contain",borderRadius:"50%"}}/>)}>
                        
                        <img src={taxi} style={{width:25,height:25,resize:"contain",borderRadius:"50%"}}/>
                        Taxi
                    </button>}

                    {index ==0 && <button onClick={e=>make_check(e,2,"Véhicule léger",<img src={vehicule_leger} style={{width:25,height:25,resize:"contain",borderRadius:"50%"}}/>)}>
                    <img src={vehicule_leger} style={{width:25,height:25,resize:"contain",borderRadius:"50%"}}/>
                        Véhicule léger
                    </button>}

                    {index ==0 && <button onClick={e=>make_check(e,3,"Poids lourd",<img src={vehicule_lourd} style={{width:25,height:25,resize:"contain",borderRadius:"50%"}}/>)}>
                    <img src={vehicule_lourd} style={{width:25,height:25,resize:"contain",borderRadius:"50%"}}/>
                        Poids lourd
                    </button>}

                    {index==0 && <button onClick={e=>make_check(e,4,"Bus",<img src={bus} style={{width:25,height:25,resize:"contain",borderRadius:"50%"}}/>)}>
                    <img src={bus} style={{width:25,height:25,resize:"contain",borderRadius:"50%"}}/>
                        Bus
                    </button>}
                    
                </div>
            </div>
            <div className="recherche_body">
                <div>
                {
                    pilotes_show.map((pilote)=>{
                        return <Pilote pilote={pilote} />
                    })
                }
                </div>
                
            </div>
        </div>
    );
}

export default Recherche;