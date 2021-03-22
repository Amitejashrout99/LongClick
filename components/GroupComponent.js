import React,{Component,useState,useEffect} from 'react';
import {Card,Input,Button} from 'react-native-elements';
import {ScrollView,Text,View,StyleSheet} from 'react-native';
import {io} from 'socket.io-client';
import {connect,useSelector} from 'react-redux';




/*const mapStateToProps= state =>{
    return{
        users:state.users,
    };
};



class Group extends Component{

    constructor(props)
    {
        super(props);
        this.state={
            message:"",
            messages:[]
        }
    }

    componentDidMount(){
        
        const socket= io("http://192.168.1.8:3000",{
            query: `token=${this.props.users.jwtToken}`
        });

        socket.emit('onlineUser',"Ravi");

        socket.on('connection', () => {
            socket.on('messages',(messages)=>{
                //console.log(messages);
    
                this.setState({messages:messages});
            });  
        });
        
        socket.on('messages',(messages)=>{
            //console.log(messages);

            this.setState({messages:messages});
        });
    }

    sendMessage=()=>{
        //alert(this.state.message);
        socket.emit('addMessage',this.state.message);
        //this.updateMessages();
    }    




    render(){
        return(
            <View style={styles.container}>
                <Input
                    label="new Message"
                    placeholder="Enter new Message"
                    onChangeText={(value)=>this.setState({message:value})}
                />
                <Button title="Send Message" onPress={this.sendMessage} />
                <Text>{this.state.messages}</Text>
            </View>
            
        );
    }
}*/

function Group(props)
{
    let users= useSelector((state)=>state.users);
    const[messages,setMessages]=useState([]);
    const[message,setMessage]=useState('');
    const socket1= io("http://192.168.1.8:3000",{
            query: `token=${users.jwtToken}`
    });
    
    useEffect(()=>{

        /*const socket= io("http://192.168.1.8:3000",{
            query: `token=${users.jwtToken}`
        });*/

        socket1.emit('onlineUser',"Ravi");
        socket1.on('messages',(messages)=>{
            //console.log(messages);
            setMessages(messages);
        });

    },[]);

    const sendMessage=()=>{
        socket1.emit('addMessage',message);
    }

    return(
        <View style={styles.container}>
                <Input
                    label="new Message"
                    placeholder="Enter new Message"
                    onChangeText={(value)=>setMessage(value)}
                />
                <Button title="Send Message" onPress={sendMessage} />
                <Text>{messages}</Text>
        </View>
    );


}

const styles= StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});


export default Group;