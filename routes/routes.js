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

    const getRegister = async (req, res) => {
        const allAreas = await spazaSugggest.areas()
        res.render('register_spaza', {
            allAreas,
        })
    }
    const postRegister = async (req, res) => {
        const { name, day } = req.body
        if(!name || !day){
            res.redirect("/register")
        } else{
            const code = await spazaSugggest.registerSpaza(name, day)
            const allAreas = await spazaSugggest.areas()
            res.render("register_spaza", {
                allAreas,
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

    const getSpaza = async (req, res) => {
        res.render('spaza_code')
    }

    const postSpaza = async (req, res) => {
        const { code } = req.body
        if(!code){
            res.redirect(`/register-spaza`) 
        } else{
            const spaza = await spazaSugggest.spazaLogin(code)
            res.redirect(`/spaza/${code}`)
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


    const spazaPage = async (req, res) => {
        const { id } = req.params
        const suggestions = await spazaSugggest.suggestionsForArea(id)
        res.render('areas', {
            suggestions,
        })
    }

    const postSpazaPage = async (req, res) => {

        const suggestions = await spazaSugggest.suggestionsForArea(id)
    }   

    return {
        getLanding,
        postLanding,
        getRegister,
        postRegister,
        getLogin,
        postLogin,
        getSpaza,
        postSpaza,
        clientPage,
        postClientPage,
        spazaPage,
        postSpazaPage
    }

}
