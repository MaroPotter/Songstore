import jsPDF from "jspdf";
import "jspdf-autotable";
const generatePDF = tickets => {
    // initialize jsPDF
    const doc = new jsPDF();

    // define the columns we want and their titles
    const tableColumn = ["Id", "Title", "Artist", "Selected license", "Paid price", "Purchaser"];
    //  define an empty array of rows
    const tableRows = [];
    doc.save(`report.pdf`);
};

export default generatePDF;