    //hit init first then define all buttons and stuff -- probably just going to have a default view 

    let calendar =  class {

        //configure the calendar
        config = () => {
            this.init = this.getCalendar(new Date());
            this.cal = null;
            this.nextClick = document.getElementById("next"); //button
            this.backClick = document.getElementById("back"); //button  
            this.todayClick = document.getElementById("today"); //button
            this.searchKeyup = document.getElementById("searchKeyUp"); //input
            this.fileToGetBooked = "file path"; //file path for getting bookings | getBooked -- get all booked values and insert into alotted slots
            this.fileToPushAppointment = "file path"; //file path to insert appointment | insertIntoAppointment -- post the appointment time and information
            this.searchEmailFilePath = "file path", //file path to search email | displayAppointmentTime -- when user searches email, they can search there time
            this.timeList = []; // this is O(1) * timelist for each load in when change arr to object -- array
            this.hideBackButton = false; //call this at bottom of display...if true rid back buton -- if false -- dont rid back button -- boolean
            this.hidePastDays = false; //call this at bottom of display...if true rid back buton -- if false -- dont rid back button -- boolean
            this.load = false; //whether to load persisted  
            this.redirectUrl - null; //url to redirect to when the form is complete -- just hits the if statement you want -- make this optional -- or just remove and showw the message!
            this.redirectMessage = "message you want to show to your user on submission";
            this.cssTemplate: "define your css template";
        }

        //onclicks tied to next three functions
        events = () => {
            this.todayClick.onclick = this.today;
            this.nextClick.onclick = this.next;
            this.backClick.onclick = this.back;  
            this.searchKeyup = (e) => { this.searchEmail(e.target.value) };
        }

        //set the globals
        globals = () => {
            this.currentDate = new Date();
            this.currentDayG = 1;
            this.currentIndexOfMonthG = null; 
            this.currentMonthNameG = null;
            this.currentYearG = null;
            this.alottedSlots = [];
            this.amountOfDays = {
            jan: { month: 31, index: 0 },
            feb: { month: ((this.currentYearG % 4 == 0) && (this.currentYearG % 100 != 0)) || (this.currentYearG % 400 == 0) ? 29 : 28, index: 1 },
            mar: { month: 31, index: 2 },
            apr: { month: 30, index: 3 },
            may: { month: 31, index: 4 },
            jun: { month: 30, index: 5 },
            jul: { month: 31, index: 6 },
            aug: { month: 31, index: 7 },
            sep: { month: 30, index: 8 },
            oct: { month: 31, index: 9 },
            nov: { month: 30, index: 10 },
            dec: { month: 31, index: 11 },
        }
    }


    //display calendar
    getCalendar = (date) => {
    
        
        this.currentMonthNameG = date.toString().split(" ")[1].toLowerCase(); 
        this.currentYearG = parseInt(date.toString().split(" ")[3].toLowerCase());
        this.currentIndexOfMonthG = this.amountOfDays[this.currentMonthNameG].index; 

    
        var startOn = new Date(this.currentYearG, this.currentIndexOfMonthG, 1).toString().split(" ")[0].toLocaleLowerCase(); 
        var arrayOfDays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]; 
        startOn = arrayOfDays.indexOf(startOn) + 1;

    
        this.cal.innerHTML = ``;
        var elem = this.cal;
        var thCount = 0;
        var tr = document.createElement("TR");

    
        for(let i = 1; i < startOn; i++) {  

            if(thCount === 7) { 
                elem.append(tr);
                var tr = document.createElement("TR"); 
                thCount = 0;
            };

            var th = document.createElement("TH");
            th.className = "infoBox";
            th.innerText = "x";
            tr.append(th); 
            thCount+=1; 

        }
    
        let days = this.amountOfDays[this.currentMonthNameG].month; 
    
        for(let i = 1; i <= days; i++) {

            if(thCount === 7) { 
                elem.append(tr); 
                var tr = document.createElement("TR");
                thCount = 0;
            };

            var th = document.createElement("TH");
            th.className = `infoBox`;
            th.id = `highlight-${i}`;
            th.innerText = i;
            th.onclick = () => { showForm(i, this.currentYearG, this.currentIndexOfMonthG, this.currentMonthNameG); };
            th.onmouseover = () => { addNumber(i); eliminateBookedEvents(i, this.currentYearG, this.currentIndexOfMonthG, this.currentMonthNameG);  }
            tr.append(th);
            thCount+=1; 

        }
        
        elem.append(tr)
        document.getElementById("date").innerText = `${this.currentIndexOfMonthG+1}/${this.currentYearG} | ${this.currentMonthNameG.toUpperCase()} ${this.currentDayG} ${this.currentYearG}`;

        this.load ? this.loadInTakenTimes() : this.showNoLoad("loading data not set..");
        this.hideBackButton ? this.hideBackButtonNone() : this.showNoLoad("back button showing on same month and year..");
        this.hidePassedDays ? this.hidePassedDaysNone() : this.showNoLoad("passed days not showing on month and year..");

    }

    showNoLoad = (message) => {
        console.log(message);
    }
    
    //go to today
    today = () => {
        var date = new Date();
        var day = date.toString().split(" ")[2];
        getCalendar(date);
        var string = "highlight-"+day;
        document.getElementById(string).style.backgroundColor = "lightblue";
    }
    
    
    //move next in calendar
    next = () => {
        this.currentIndexOfMonthG === 11 ? (this.currentYearG += 1, this.currentIndexOfMonthG = 0) : (this.currentIndexOfMonthG += 1);
        getCalendar(new Date(this.currentYearG, this.currentIndexOfMonthG, 1));
    }
    
    
    //move back in calendar
    moveBack = () => {
        this.currentIndexOfMonthG === 0 ? (this.currentYearG -= 1, this.currentIndexOfMonthG = 11) : (this.currentIndexOfMonthG -= 1);
        getCalendar(new Date(this.currentYearG, this.currentIndexOfMonthG, 1));
    }
    

    //replace number in string on hover
    addNumber = (pushNum) => {
        var dateString = document.getElementById("date");
        var arr = dateString.innerText.split(" ");
        arr[3] = pushNum;
        arr = arr.join(" ");
        document.getElementById("date").innerText = arr;
    }
    
    
    //load in taken times for this month and year
    loadInTakenTimes = () => {
        
        $.ajax({
            type: "POST",
            url: this.fileToGetBooked,
            data: {
                getBooked: "true",
                globalYear: this.currentYearG,
                globalMonthIndex: this.currentIndexOfMonthG
            },
            dataType: "json",
            success: function(result, status, xhr) {
                
                this.alottedSlots = [];
    
                for(let i = 0; i < result.length; i++) { 
                    this.alottedSlots.push({ //change to objet to reduce lookup
                        year: result[i].year, 
                        monthName: result[i].monthName,
                        monthIndex: result[i].monthIndex,
                        day: result[i].day,
                        time: result[i].time
                    });
                    
                }
                
            },
            error: function(xhr, status, error) {
                console.log("no rows"); 
            },
        });
        
    }

    //hide back button
    hideBackButtonNone = () => {

    }

    //hide passed days
    hidePassedDaysNone = () => {

    }
    
    //on hover get booked events for each day
    eliminateBookedEvents = (day, year, monthIndex, monthName) => {
        
        var date = new Date();
        var todayYear = parseInt(date.toString().split(" ")[3]);
        var todayMonthIndex = this.amountOfDays[date.toString().split(" ")[1].toLowerCase()].index; 
        var todayDay = parseInt(date.toString().split(" ")[2]);

        
        var b = document.getElementById("errorBooked");
            

        if((monthIndex < todayMonthIndex && year === todayYear) ||
            (year < todayYear) || 
            (monthIndex === todayMonthIndex && year === todayYear && day < todayDay)) {
            b.innerText = "X"; b.style.color = "red";
            return;
        }

        var originalSet = ["6am", "9am", "3pm", "7pm"];  
                  
        for(let i = 0; i < this.alottedSlots.length; i++) { //change array to object to reduce from N to O(1)*4 ...change indexOf to push to reduce 'N' to O(1) -- not really n^2 .. just do (day and time lookup for each in original set..if true then splice or push)
            if(this.alottedSlots[i].day === day) { 
                originalSet.splice(originalSet.indexOf(this.alottedSlots[i].time), 1); 
            } 
        };
        
            
        if(originalSet.length === 0) { b.innerText = "Booked"; b.style.color = "red";  } else { b.innerText = "Appointments available"; b.style.color = "green";  }

    }
    
    
    //displayForm when click on cell
    showForm = (day, year, monthIndex, monthName) => {
        var date = new Date();
        var todayYear = parseInt(date.toString().split(" ")[3]);
        var todayMonthIndex = this.amountOfDays[date.toString().split(" ")[1].toLowerCase()].index; 
        var todayDay = parseInt(date.toString().split(" ")[2]);
            

        if((monthIndex < todayMonthIndex && year === todayYear) ||  (year < todayYear) ||  (monthIndex === todayMonthIndex && year === todayYear && day < todayDay)) {
            var element = document.getElementById("errorShake");
            TweenMax.to(element, 0.1, {x:"+=20", yoyo:true, repeat:5});
            return;
        }
            
        document.getElementById("toggleDisplayB").style.display = "block";
        document.getElementById("toggleDisplay").style.display = "none";

        var getDayName = new Date(year, monthIndex, day).toString().split(" ")[0];

        var temp = ``;

        temp += `
        <div class = "row container" style = "text-align: center">
        <input hidden id = "monthIndexS" value = "${monthIndex}" />
        <input hidden id = "dayS" value = "${day}" />
        <input hidden id = "yearS" value = "${year}" />
        <input hidden id = "monthNameS" value = "${monthName}" />
        <input hidden id = "dayNameS" value = "${getDayName}" />
        <div class = "col-md-12">
        <h1>
        ${getDayName} ${monthName} ${day} ${year}
        </h1>`;

        var originalSet = ["6am", "9am", "3pm", "7pm"];  

        for(let i = 0; i < this.alottedSlots.length; i++) {  //change array to object to reduce from N to O(1)*4 ...change indexOf to push to reduce 'N' to O(1) -- not really n^2 .. just do (day and time lookup for each in original set..if true then splice or push)	
            if(this.alottedSlots[i].day === day) {  
                originalSet.splice(originalSet.indexOf(this.alottedSlots[i].time), 1); 
            } 
        };
                  
        if(originalSet.length === 0) { back(); return; } 
                  
        for(let i = 0; i < originalSet.length; i++) {
            temp +=`
            <input type="radio" id="${originalSet[i]}" name="timeS" value="${originalSet[i]}" class="form-check-input xx"> 
            <label for="${originalSet[i]}">${originalSet[i]}</label><br>`; 
        };
                  
        temp += 
        `<p></p>
        <p>Lets have some coffee ☕ ...over zoom</p>
        </div>
        <input id = "emailS" class = "form-control" placeholder = "email" style = "width: 40%; height: 40px; margin: auto">
        <p id = "emailError" style = "color: red"> </p>
        <input id = "passwordS" class = "form-control" placeholder = "password" style = "width: 40%; height: 40px; margin: auto">
        <small> optional for viewing and canceling appointment </small>
        <p id = "passwordErrorS" style = "color: red"> </p>
        <br>
        <button class = "btn btn-lg" style = "color: white; background-color: lightcoral; border-radius: 0px; font-size: 24px; box-shadow: 2px 2px 2px black" onclick = "submit()" >Schedule!</button>
        <br>
        <br>
        <small onclick = "back()" style = "cursor: pointer; font-weight: bold" >calendar</small>
        </div>`;
                   
        document.getElementById("toggleDisplayB").innerHTML = temp;
        document.getElementById("emailS").focus();
        document.getElementById("emailS").select();

    }
    
    
    //go back to the calendar    
    back = () => {
        document.getElementById("toggleDisplayB").style.display = "none";
        document.getElementById("toggleDisplay").style.display = "block";
    }
    
    
    //check errors and submit form
    submit = () => {
        
        var day = document.getElementById("dayS");
        var dayName = document.getElementById("dayNameS");
        var monthName = document.getElementById("monthNameS");
        var monthIndex = document.getElementById("monthIndexS");
        var year = document.getElementById("yearS");
        var email = document.getElementById("emailS");
        var time = $('input[name="timeS"]:checked' ).val();
        
        var count = 0;

        if(time === undefined) { count++; alert("please select a time") };
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email.value)) { count++; document.getElementById("emailError").innerText = "*Please enter a valid email"; };
        
        if(count > 0) { return; }
        
        $.ajax({
            type: "POST",
            url: this.fileToPushAppointment, 
            data: {
                insertIntoAppointment: "true",
                day: parseInt(day.value),
                dayName: dayName.value,
                monthName: monthName.value,
                monthIndex: parseInt(monthIndex.value),
                year: parseInt(year.value),
                email: email.value,
                time: time
            },
            dataType: "json",
            success: function(result, status, xhr) {

                if(result === "This user already exists") { 
                    document.getElementById("emailError").innerText = "*Appointment already in place, please cancel.";
                    return;
                }
                
                location.replace(`${this.redirectUrl}?show='${this.redirectMessage}'`);
                
            },
            error: function(xhr, status, error) {
                console.log(error);
            },
        });
        
    }
    
    
    //search if an email exists and show appointment time and password and cancel button
    searchEmail = (email) => {
        
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {  
            document.getElementById("removePassword") ? document.getElementById("removePassword").remove() : ""; 
            return;
        };

        $.ajax({
            type: "POST",
            url: this.searchEmailFilePath, 
            data: {
                displayAppointmentTime: "true",
                email: email,
            },
            dataType: "json",
            success: function(result, status, xhr) {
                
                if(result.length > 0) { 
                    showOrHidePasswordAndCancelButton(result);
                } else if(result === 0) {
                    showOrHidePasswordAndCancelButton(0);
                } else {
                    showOrHidePasswordAndCancelButton(0);
                }
                
            },
            error: function(xhr, status, error) {
                alert(error);
            },

        });
        
    }
    
    
    //show or hide button -- 
    showOrHidePasswordAndCancelButton = (showOrHide) => {
        
        if(typeof(showOrHide) === "object") {   

            if(document.getElementsByClassName("checkAddedOnDelay")[0]) { return; } 

            var html = `
                <br>
                <h2>Your appointment is on <b> ${showOrHide[0].dayName} ${showOrHide[0].monthName} ${showOrHide[0].day} ${showOrHide[0].year} </b> at <b> ${showOrHide[0].time} </b> </h2>
                <button class = "btn" style = "background-color: red; border-radius: 0px; color: white; box-shadow: 2px 2px 2px black" id = "remove" onclick = "showPassword()">Remove Appointment</button>
            `;

            var elem = document.createElement("DIV"); //appending to avoid document re rendering
            elem.setAttribute("id", "removePassword");
            elem.classList.add("checkAddedOnDelay");
            elem.innerHTML = html;
            document.getElementById("pushPasswordOption").append(elem);

        } else {
            document.getElementById("removePassword") ? document.getElementById("removePassword").remove() : ""; 
            return;
        }
        
    }
    
    
    showPassword() {}
    
    
    removeAppointment() {}
    
    
    keepSearchTriesOnServerOverLoadRedirect() {}
    
    
    liveChat() {}

}


export default calendar;




    

