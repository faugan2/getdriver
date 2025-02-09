import HeaderBack from "../components/HeaderBack";
import "../styles/commander.scss";
import SearchIcon from '@material-ui/icons/Search';
import Destination from "../components/Destination";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import map from "../components/img/map.png";
import {useState,useEffect} from "react";
import {useSelector,useDispatch} from "react-redux";
import {selectSearchDestinationText,selectType, setCourse,setDepart,setDestination,selectDepart,selectDestination, setSearchDestinationText} from "../features/counterSlice";
import { useHistory } from 'react-router';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import RoomIcon from '@material-ui/icons/Room';
import {auth} from "../firebase_file";

import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ClearIcon from '@material-ui/icons/Clear';

import { Loader } from "@googlemaps/js-api-loader"
import Maps from "../components/Map";
import Map2 from "../components/Map2";
import Map3 from "../components/Map3";
import Places from "../components/Places";
import CircularProgress from '@material-ui/core/CircularProgress';


const Commander=(props)=>{
	
	
	const t=useSelector(selectType);
	
	const [arrive,set_arrive]=useState(false);
	const [depart,set_depart]=useState("");
	const [destination,set_destination]=useState(null);
	const [categorie,set_categorie]=useState("");
	const [type,set_type]=useState(false);
	const [longitude,set_longitude]=useState(0);
	const [latitude,set_latitude]=useState(0);
	
	const dispatch=useDispatch();
	
	const history=useHistory();
	
	const show_depart=()=>{
		
		const cat=document.querySelector("#categorie").value;
		set_categorie(cat);
		set_type(true);
	}
	
	const show_destination_input=()=>{
		if(depart==""){
			alert("Aucune position de depart n'est saisie");
			return;
		}
		set_arrive(true);
	}
	const show_commande_details=()=>{
		if(destination==""){
			alert("Aucune destination n'est saisie");
			return;
		}
		
		const course={depart,destination,categorie};
		dispatch(setCourse(course));
		history.push("/details-commande")
	}
	
	const choisir_emplacement=(nom,quartier)=>{
		if(arrive==false){
			set_depart(nom);
		}else{
			set_destination(nom);
		}
	}
	const d=useSelector(selectDepart)

	useEffect(()=>{
		console.log("le depart est ",d);
	},[d]);

	const [alerte,set_alerte]=useState("Détection de votre position...");
	useEffect(()=>{
		const google=window.google ;
		console.log("je sui sgoogle",google);
		dispatch(setDepart(null));
		setTimeout(()=>{
			navigator.geolocation.getCurrentPosition(function(position) {
				console.log("position",position);
				const objet={lat:position.coords.latitude,lng:position.coords.longitude};
				dispatch(setDepart(objet));
				set_longitude(position.coords.latitude);
				set_latitude(position.coords.longitude)
				set_arrive(true);
			  },
	
			  showError,
			  { enableHighAccuracy: true, timeout: 5000},
			  );
		},1000)
		
		
	},[])

	

	function showError(error) {
		switch(error.code) {
		  case error.PERMISSION_DENIED:
			set_alerte("User denied the request for Geolocation.")
			break;
		  case error.POSITION_UNAVAILABLE:
			set_alerte("Location information is unavailable.")
			break;
		  case error.TIMEOUT:
			set_alerte("The request to get user location timed out.")
			break;
		  case error.UNKNOWN_ERROR:
			set_alerte("An unknown error occurred.")
			break;
		}
	  }

	useEffect(()=>{
		if(t==null) return;
		set_type(true);
		set_categorie(t);
	},[t]);

	


	

	const dep=useSelector(selectDepart);
	const des=useSelector(selectDestination);


	
	const [search_destination,set_search_destination]=useState("");

	const clear_search_destination=(e)=>{
		set_search_destination("");
		dispatch(setSearchDestinationText(""));
		document.querySelector("#input_search").focus();
	}

	function initService(depart) {
        
        const center = {lat:depart.lat,lng:depart.long};
        // Create a bounding box with sides ~10km away from the center point
        const defaultBounds = {
            north: center.lat + 0.1,
            south: center.lat - 0.1,
            east: center.lng + 0.1,
            west: center.lng - 0.1,
        };

       // console.log("depart is ",center)
        const input = document.getElementById("input_search");

        const options = {
            bounds: defaultBounds,
            componentRestrictions: { country: "tg" },
            fields: ["address_components", "geometry", "icon", "name"],
            strictBounds: false,
            types: ["establishment"],
        };

        var google=window.google;
        const autocomplete = new google.maps.places.Autocomplete(input, options);
        
        /*autocomplete.addListener("place_changed",()=>{
            const place=autocomplete.getPlace();
            const lat=place.geometry.location.lat();
            const lng=place.geometry.location.lng();

           const destination={lat,lng};
           dispatch(setDestination(destination))
           prediction(input.value);
        })*/

        
       

    
          
      }

	  useEffect(()=>{
		  if(dep==null) return;
		initService(dep);
	  },[dep])

	  const search=useSelector(selectSearchDestinationText)
	  useEffect(()=>{
		  let id_inter=0;
		  
		if(search=="" && latitude!=0 && longitude!=0){
			const zone=document.querySelector("#zone_destination");
			let opacity=1;
			id_inter=setInterval(()=>{
				if(opacity==1){
					opacity=0.5;
				}else{
					opacity=1;
				}
				if(zone==null) {
					return;
				}
				zone.style.opacity=opacity;
			},500);
			
		}else{
			console.log("going to clear intervval")
			const zone2=document.querySelector("#zone_destination");
			if(zone2==null){
				return;
			}
			zone2.style.opacity=1;
			clearInterval(id_inter);
		}
	  },[search,latitude,longitude]);

	return(
		<div className="commander" style={{position:"relative"}}>
			{(longitude==0 && latitude==0) && <HeaderBack title="Patientez..." />}
			
			
			
			<div className="commander_body">
				{
					(longitude==0 && latitude==0)? 
					<div style={{backgroundColor:"#e8e8e8",display:"flex",justifyContent:"center",
					alignItems:"center",padding:"1rem",gap:"0.5rem"}}>
							<CircularProgress style={{color:"gray",fontSize:"1.2rem"}} size={15} />
							<p style={{textAlign:"center",fontSize:"0.8rem",margin:0}}>{alerte}</p>
					</div>
					:
					<div className="maps" style={{position:"relative"}}>
						<div><Map3 /></div>
						<div><Places /></div>
						<div style={{
							position:"absolute",
							top:"0rem",
							left:"0rem",
							right:"0rem",
							height:"50px",
							backgroundColor:"rgba(0,0,0,0.5)",
							display:"flex",
							alignItems:"center",
							padding:"0 0.5rem",
						}}>
								<button style={{
									backgroundColor:"var(--main)",
									border:"none",
									borderRadius:"50%",
									width:"2rem",
									height:"2rem",
									color:"var(--color)",
									marginRight:"0.5rem",
									display:"flex",
									alignItems:"center",
									justifyContent:"center",
									}}
									onClick={e=>{
										dispatch(setDepart(null));
										dispatch(setDestination(null));
										history.push("/main")
									}}
									>
									<ArrowBackIcon />
								</button>
								<div style={{
									flex:1,
									backgroundColor:"white",
									display:"flex",
									alignItems:"center",
									borderRadius:"5px",
									
									
									}}
									
									>
									<RoomIcon style={{fontSize:"1.2rem",color:"var(--color)"}}  id="zone_destination"/>
									<input 
									value={search_destination}
									onChange={e=>{
										set_search_destination(e.target.value)
										dispatch(setSearchDestinationText(e.target.value));
									}}
									style={{
										flex:1,
										padding:"0.5rem",
										border:"none",
										outline:"none",
										borderRadius:"5px",
									}}
									type="text" placeholder="Quelle est votre destination ?" id="input_search"  />
									
									{search_destination!="" && <button style={{
										backgroundColor:"white",
										border:"none",
										outline:"none",
									}}
									onClick={clear_search_destination}
									>
										<ClearIcon style={{fontSize:"1.2rem",color:"gray"}} />
									</button>
									}
									
								</div>
								<button
								style={{
									backgroundColor:"white",
									border:"none",
									borderRadius:"50%",
									width:"2rem",
									height:"2rem",
									borderRadius:"50%",
									marginLeft:"0.5rem",
									display:"none",
									alignItems:"center",
									justifyContent:"center",
									display:"none",
									alignItems:"center",
									}}
								><MoreHorizIcon/></button>
						</div>
					</div>
				}

				
				
				
			</div>
		</div>
	);
}

export default Commander;
