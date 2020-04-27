pragma solidity 0.5.16;

contract kickback {
    
    struct Person {
        address unique;
        string name;
        uint total_count;
        uint total_failure;
        uint start;
        uint end;
        bool eligible;

    }
    
    mapping (address => Person) Allperson;
    address[] public personIds;
    address[] public winningIds; 
    

    function getAlladdress() public view returns(address[] memory){
        return personIds;
    }

    function getaccount(address _address) public view returns(address, string memory, uint, uint, uint, uint, bool){
        return (Allperson[_address].unique, Allperson[_address].name, Allperson[_address].total_count, Allperson[_address].total_failure, Allperson[_address].start, Allperson[_address].end, Allperson[_address].eligible);
    }

    function updateData(address _address, string memory _name) public  {
        for(uint i =0; i < personIds.length; i++) {
            if( Allperson[personIds[i]].total_count > 0) {
                if(now > Allperson[personIds[i]].end) {
                    Allperson[_address].total_failure = Allperson[_address].total_failure + 1;
                    if(Allperson[_address].total_failure>3){
                        Allperson[_address].eligible=false;
                    }
                    Allperson[_address].start = Allperson[_address].start + 86400;
                    Allperson[_address].end = Allperson[_address].end + 86400;
                }
            }
        }

        if(Allperson[_address].total_count == 0) {
            personIds.push(_address);
            Allperson[_address].eligible = true;
            Allperson[_address].unique = _address;
            Allperson[_address].name = _name;
            Allperson[_address].total_count = 1;
            Allperson[_address].total_failure = 0;
            Allperson[_address].start = now + 86400;
            Allperson[_address].end = now + 172800;
        }
        else {
            Allperson[_address].start = Allperson[_address].start + 86400;
            Allperson[_address].end = Allperson[_address].end + 86400;
            Allperson[_address].total_count = Allperson[_address].total_count + 1;
            

        }
        winningIds.length = 0;     
        for(uint i =0; i < personIds.length; i++) {
            if(Allperson[personIds[i]].total_count >= 27) {
                if(Allperson[personIds[i]].eligible == true){
                    winningIds.push(personIds[i]);
                }

            }
        }
        
    }

    function winners() public view  returns(address[] memory ) { 
     
         return winningIds;
    }
}
