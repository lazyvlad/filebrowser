// filters.js/ts
export default {
    uppercase(val) {
      if (typeof val === "string") {
        return val.toUpperCase();
      }
      return val;
    }, 
    money(val) {
      if (typeof val === "numeric") {
        return `$${val.toFixed(2)}`;
      }
    },
    two_digits(d){
        if(0 <= d && d < 10) return "0" + d.toString();
        if(-10 < d && d < 0) return "-0" + (-1*d).toString();
        return d.toString();
    },
    date_format(d,format){

        const SHORT_MONTH_NAMES = {
            0 :'Jan',
            1 :'Feb',
            2 :'Mar',
            3 :'Apr',
            4 : 'May',
            5 : 'Jun',
            6 : 'Jul', 	
            7 :'Aug',
            8 :'Sept',
            9 :'Oct',
            10 :'Nov',
            11 :'Dec' 	
        };        

        if(!d)
            return '- - -'

        d = new Date(d);

        format = (format) ? format : 'YYYY-MM-DD';


        let month = this.two_digits(1 + d.getUTCMonth())
        let year = d.getUTCFullYear();
        let day = this.two_digits(d.getUTCDate());

        if(format.toUpperCase() == 'MM/DD/YYYY')
            return month + '/' + day + '/' + year;
        else if(format.toUpperCase() == 'MM/DD/YY')
            return month + '/' + day + '/' + year.substr(2);
        else if (format.toUpperCase() == 'YYYY-MM-DD')
            return year + '-' + month +'-' + day;	
        else if (format.toUpperCase() == 'MMM-DD-YYYY')
            return SHORT_MONTH_NAMES[d.getUTCMonth()] + '-' + day +'-' + year;
        else if (format.toUpperCase() == 'DD-MMM-YYYY')
            return day + '-' + SHORT_MONTH_NAMES[d.getUTCMonth()] +'-' + year;	
        else
            return day + '/' + month + '/' + year;        



    }
  };