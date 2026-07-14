export const getEvents = async (req, res) => {

    try {

        res.status(200).json({
            success: true,
            message: "Lista de eventos",
            data: []
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Error al obtener eventos",
            error: error.message
        });

    }

};