// Add this import at the top
import { BOLForm } from './bol/BOLForm';

// Add this state inside the LoadDashboard component
const [isBOLFormOpen, setIsBOLFormOpen] = useState(false);

// Add this button next to the Create Load button
<Button
  onClick={() => setIsBOLFormOpen(true)}
  variant="outlined"
  startIcon={<DescriptionIcon />}
  sx={{
    ml: 2,
    color: "#FFD700",
    borderColor: "#FFD700",
    '&:hover': {
      backgroundColor: "rgba(255, 215, 0, 0.1)",
      borderColor: "#FFD700",
    },
  }}
>
  New B.O.L
</Button>

// Add this at the bottom of the component's JSX
<BOLForm
  open={isBOLFormOpen}
  onClose={() => setIsBOLFormOpen(false)}
/>
