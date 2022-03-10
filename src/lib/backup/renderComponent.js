import $ from 'jquery';
import * as Handlebars from "handlebars";
import { fetchData } from './fetchData'

const renderTemplate = (divId, templateSrc, data) => {
  // rendering hbs
  const template = Handlebars.compile(templateSrc);
  $(divId).html(template(data));

}

export const renderComponent = async (divId, hbs_file_name, data) => {
  const templateUrl = "./src/" + hbs_file_name;
  const templateSrc = await fetchData(templateUrl);
  renderTemplate(divId, templateSrc, data)
}
