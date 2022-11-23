export const Routes = (spazaSugggest) => {
    const getLanding = async (req, res) => {
        res.render('register')
    }
    const postLanding = async (req, res) => {
        const { name } = req.body
        if(!name){
            res.redirect("/")
        } else{
            const code = await spazaSugggest.registerClient(name)
            res.render("register", {
                code
            })
        }
       
    }

    const getLogin = async (req, res) => {
        res.render('code')
    }

    const postLogin = async (req, res) => {
        const { code } = req.body
        if(!code){
            res.redirect(`/login`) 
        } else{
            const client = await spazaSugggest.clientLogin(code)
            const { id } = client
            res.redirect(`/client/${id}`)
        }
    }


    const clientPage = async (req, res) => {
        const allAreas = await spazaSugggest.areas()
        const { id } = req.params
        const suggestions = await spazaSugggest.suggestions(id)
        res.render('schedule', {
            id,
            allAreas,
            suggestions,
            helpers: {
                separator: function (user) {
                    let working = ''
                    if (user.length <= 2) {
                        working = 'yellow_day'
                    } else if (user.length === 3) {
                        working = 'green_day'
                    } else if (user.length > 3) {
                        working = 'red_day'
                    }
                    return working
                },
            }
        })
    }

    const postClientPage = async (req, res) => {
        const { id } = req.params
        const { day, product } = req.body
        if(!day || !product){
            res.redirect(`/client/${id}`)
        }else{
            await spazaSugggest.suggestProduct(day, id, product)
            res.redirect(`/client/${id}`)
        }
    }
    return {
        getLanding,
        postLanding,
        getLogin,
        postLogin,
        clientPage,
        postClientPage
    }

}
