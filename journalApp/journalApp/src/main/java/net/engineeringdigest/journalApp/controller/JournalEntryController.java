package net.engineeringdigest.journalApp.controller;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.engineeringdigest.journalApp.entity.JournalEntry;
import net.engineeringdigest.journalApp.entity.User;
import net.engineeringdigest.journalApp.service.JournalEntryService;
import net.engineeringdigest.journalApp.service.UserService;

@RestController
@RequestMapping("/journal")
public class JournalEntryController {


@Autowired
    private JournalEntryService journalEntryService;
    @Autowired
    UserService userService;

    @GetMapping("{userName}")
  public ResponseEntity<?> getAllJournalEntriesoftheUser(@PathVariable String userName){
     
     User user = userService.findByUserName(userName);

    List<JournalEntry> all = user.getJournalEntries();
      
      if (all != null && !all.isEmpty()) {
          
        return  new ResponseEntity<>(all,HttpStatus.OK);
      }
        
      return  new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
  
  
  @PostMapping("{userName}")
  public  ResponseEntity<?> saveEntry(@RequestBody JournalEntry myEntry, @PathVariable String userName){
    
    try{
     
      myEntry.setDate(LocalDateTime.now());
      journalEntryService.saveEntry(myEntry, userName);
    
    }catch(Exception e){
      return  new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
    
    return new ResponseEntity<>(HttpStatus.ACCEPTED);
  
  }

  @GetMapping("id/{myId}")
  public ResponseEntity<JournalEntry> getReqId(@PathVariable ObjectId myId){
   
       Optional<JournalEntry> journalEntry = journalEntryService.getbyId(myId); 
     
      if (journalEntry.isPresent()) {
          
            return new ResponseEntity<>(journalEntry.get(), HttpStatus.OK);
      }
            return  new ResponseEntity<>(HttpStatus.NOT_FOUND);
        
    }

    
@DeleteMapping("id/{userName}/{myId}")
public ResponseEntity<JournalEntry> deleteJournalEntry(@PathVariable String userName, @PathVariable ObjectId myId){

   journalEntryService.deleteEntry(myId, userName);
   return new ResponseEntity<>(HttpStatus.NO_CONTENT);

}
    
  
  @PutMapping("/{userName}/{myId}")
  public ResponseEntity<JournalEntry> updatingEntry(
    @PathVariable ObjectId myId, 
    @RequestBody JournalEntry newEntry,
    @PathVariable String userName
    ) {
              
    JournalEntry oldEntry =  journalEntryService.getbyId(myId).orElse(null);
   
    if(oldEntry != null){
          
        oldEntry.setTittle(newEntry.getTittle() != null && !newEntry.getTittle().equals("") ? newEntry.getTittle() : oldEntry.getTittle() );
        oldEntry.setContent(newEntry.getContent() != null && !newEntry.getContent().equals("") ? newEntry.getContent() : oldEntry.getContent());
        
        journalEntryService.saveEntry(oldEntry);
       
         return new ResponseEntity<>(oldEntry, HttpStatus.ACCEPTED);

    }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);

  }
  
}  

