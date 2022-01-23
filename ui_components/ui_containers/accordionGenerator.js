import React from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';

/**
 * 
 * @param {object} comps An object of componnents (name:component) we want to insert into the accordion
 */
const generateAccordion = (comps,selectedComp)=>{
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    let generatedAccordions = Object.keys(comps).map((comp,idx)=>{
        return <Accordion key={comp} expanded={expanded === comp} onChange={handleChange(comp)}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    disabled={!comps[comp].enabled}
                    >
                    <Typography>{comp}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {comps[comp].component}
                    </AccordionDetails>
                </Accordion>
    })
    return <div>
        {generatedAccordions}
    </div>
}

export default generateAccordion;