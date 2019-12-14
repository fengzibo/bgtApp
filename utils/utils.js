import _ from 'lodash';  
const utils = {
	format_date:(time,format='-') =>{
		const date = new Date(time);
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
		month = month > 9 ? month : '0' + month;;
		day = day > 9 ? day : '0' + day;
		return `${year}${format}${month}${format}${day}`;
	},
	_get:(object, path, defaultValue) =>{
		return _.get(object, path, defaultValue)
	}
}

export default utils
